/* eslint-disable no-console */
import { BetaAnalyticsDataClient } from '@google-analytics/data';
import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma"

import { getServerSession } from "@/graphql/context";

import { reportCountry, reportDevice, reportReferral, reportSessionPerDay, reportViewPerPage, totalAll } from './reportQuery';
import { ProcessedCountryData, ProcessedDeviceData, ProcessedReferralData, ProcessedReportData, ProcessedSessionsPerDayData } from './types';


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
    // site_url = 'https://digital.letterpad.app'
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

    const [response, nextRes] = await Promise.all([
        runReport1(dateRanges, site_url),
        runReport2(dateRanges, prevDateRanges, site_url)
    ]);
    return NextResponse.json({ ...response, ...nextRes });
}



const queries = [reportViewPerPage, reportReferral, reportCountry, reportSessionPerDay, reportDevice]
export async function runReport1(dateRanges: any, site_url: string) {

    const response = await analyticsDataClient.batchRunReports({
        property: `properties/${process.env.GA_PROPERTY_ID}`,
        requests: [
            ...queries.map((query) => ({ ...query(site_url).query, dateRanges })),

        ],
    }).catch(console.log);

    if (!response || !response[0].reports) {
        return null
    }
    const [{ reports }] = response;

    const result = queries.map((query, index) => query(site_url).parser(reports[index]))
    type L = typeof result extends Array<infer R> ? R : Record<string, any>;
    return Object.assign({}, ...result) as {
        data: ProcessedReportData[];
        referals: ProcessedReferralData[];
        countries: ProcessedCountryData[];
        sessionsPerDay: ProcessedSessionsPerDayData[];
        device: ProcessedDeviceData[];
    }
}



export async function runReport2(dateRanges: any, prevDateRanges: any, site_url: string) {
    const response = await analyticsDataClient.batchRunReports({
        property: `properties/${process.env.GA_PROPERTY_ID}`,
        requests: [
            { ...totalAll(site_url).query, dateRanges },
            { ...totalAll(site_url).query, dateRanges: prevDateRanges },
        ],
    }).catch(console.log);


    if (!response || !response[0].reports) {
        return null;
    }
    const [{ reports }] = response;
    return { ...totalAll(site_url).parser(reports[0], reports[1]) };
}