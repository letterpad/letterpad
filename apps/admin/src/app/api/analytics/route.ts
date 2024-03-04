/* eslint-disable no-console */
import { BetaAnalyticsDataClient } from '@google-analytics/data';
import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma"

import { getServerSession } from "@/graphql/context";

import { reportCountry, reportDevice, reportReferral, reportViewPerPage, reportViewPerPage1, totalAll } from './reportQuery';
import { ProcessedCountryData, ProcessedReferralData, ProcessedReportData, ProcessedTotalData } from './types';
import { processCountryData, processDeviceData, processReferralData, processReportData, processReportData1, processTotalData } from './utils';

const analyticsDataClient = new BetaAnalyticsDataClient({
    credentials: {
        client_email: process.env.GA_CLIENT_EMAIL!,
        private_key: process.env.GA_PRIVATE_KEY!,
    },
});

export async function GET(req: Request) {
    const session = await getServerSession({ req });
    if (!session?.user.email) {
        return NextResponse.json({ error: "You are not authorized" }, { status: 401 });
    }

    const setting = await prisma.setting.findFirst({
        where: {
            author: {
                id: session.user.id
            }
        },
        select: {
            site_url: true
        }
    });
    let site_url = setting?.site_url!;
    if (!setting?.site_url) {
        site_url = `https://${session.user.username}.letterpad.app`;
    }
    const params = new URL(req.url).searchParams;
    const startDate = params.get("startDate");
    const endDate = params.get("endDate");
    const prevStartDate = params.get("prevStartDate");
    const prevEndDate = params.get("prevEndDate");


    const dateRanges = [{
        startDate,
        endDate,
    }];

    const prevDateRanges = [{
        startDate: prevStartDate,
        endDate: prevEndDate,
    }];

    const [response, nextRes] = await Promise.all([runReport(dateRanges, prevDateRanges, site_url), runReportSingle(dateRanges, site_url)]);
    const { data, referals, countries, total } = processReports(response);
    const { device, nextData } = processReports1(nextRes);

    return NextResponse.json({ total, data, referals, countries, device, nextData });
}



async function runReport(dateRanges: any, prevDateRanges: any, site_url: string) {
    const response = await analyticsDataClient.batchRunReports({
        property: `properties/${process.env.GA_PROPERTY_ID}`,
        requests: [
            { ...reportViewPerPage(site_url), dateRanges },
            { ...reportReferral(site_url), dateRanges },
            { ...reportCountry(site_url), dateRanges },
            { ...totalAll(site_url), dateRanges },
            { ...totalAll(site_url), dateRanges: prevDateRanges },
        ],
    }).catch(console.log);
    return response;
}

async function runReportSingle(dateRanges: any, site_url: string) {
    const response = await analyticsDataClient.batchRunReports({
        property: `properties/${process.env.GA_PROPERTY_ID}`,
        requests: [
            { ...reportViewPerPage1(site_url), dateRanges },
            { ...reportDevice(site_url), dateRanges },
        ],
    }).catch(console.log);
    return response;
}

function processReports(response: any): {
    data: ProcessedReportData[];
    referals: ProcessedReferralData[];
    countries: ProcessedCountryData[];
    total: ProcessedTotalData | {};
} {
    if (!response) {
        return { data: [], referals: [], countries: [], total: {} };
    }
    const [{ reports }] = response;
    const report1 = reports?.[0];
    const report2 = reports?.[1];
    const report3 = reports?.[2];
    const report4 = reports?.[3];
    const report5 = reports?.[4];

    const data = processReportData(report1);
    const referals = processReferralData(report2);
    const countries = processCountryData(report3);
    const total = processTotalData(report4, report5)[0];

    return { data, referals, countries, total };
}

function processReports1(response: any) {
    if (!response) {
        return { device: [], nextData: [] };
    }
    const [{ reports }] = response;
    const report1 = reports?.[0];
    const report2 = reports?.[1];

    const nextData = processReportData1(report1);
    const device = processDeviceData(report2);

    return { device, nextData };
}





