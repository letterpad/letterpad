/* eslint-disable no-console */
import { BetaAnalyticsDataClient } from '@google-analytics/data';
import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma"

import { getServerSession } from "@/graphql/context";

import { reportCountry, reportDevice, reportReferral, reportViewPerPage, reportViewPerPage1, totalAll } from './reportQuery';
import { processCountryData, processDeviceData, processReferralData, processReportData, processReportData1, processTotalData } from './utils';
import { getRootUrl } from '../../../shared/getRootUrl';

const analyticsDataClient = new BetaAnalyticsDataClient();


function getDateRanges() {
    return [{
        startDate: "7daysAgo",
        endDate: "today",
    }];
}

function getPrevDateRanges() {
    return [{
        startDate: "15daysAgo",
        endDate: "8daysAgo",
    }];
}


export async function GET(req: Request) {
    const params = new URL(req.url).searchParams;
    const startDate = params.get("startDate");
    const endDate = params.get("endDate");
    const prevStartDate = params.get("prevStartDate");
    const prevEndDate = params.get("prevEndDate");

    let dateRanges = getDateRanges();
    let prevDateRanges = getPrevDateRanges();
    if (startDate && endDate && prevStartDate && prevEndDate) {
        dateRanges = [{
            startDate,
            endDate,
        }];
        prevDateRanges = [{
            startDate: prevStartDate,
            endDate: prevEndDate,
        }];
    }

    const res = await runReportSingle(dateRanges);
    const [response, nextRes] = await Promise.all([runReport(dateRanges, prevDateRanges), runReportSingle(dateRanges)]);
    const { data, referals, countries, total } = processReports(response);
    const { device, nextData } = processReports1(nextRes);

    return NextResponse.json({ total, data, referals, countries, device, nextData });
}



async function runReport(dateRanges: any, prevDateRanges: any) {
    console.time("Running Report");
    const response = await analyticsDataClient.batchRunReports({
        property: `properties/316753652`,
        requests: [
            { ...reportViewPerPage("https://letterpad.app"), dateRanges },
            { ...reportReferral("https://letterpad.app"), dateRanges },
            { ...reportCountry("https://letterpad.app"), dateRanges },
            { ...totalAll("https://letterpad.app"), dateRanges },
            { ...totalAll("https://letterpad.app"), dateRanges: prevDateRanges },
        ],
    }).catch(console.log);
    console.timeEnd("Running Report");
    return response;
}

async function runReportSingle(dateRanges: any) {
    console.time("Running Report");
    const response = await analyticsDataClient.batchRunReports({
        property: `properties/316753652`,
        requests: [
            { ...reportViewPerPage1("https://letterpad.app"), dateRanges },
            { ...reportDevice("https://letterpad.app"), dateRanges },
        ],
    }).catch(console.log);
    console.timeEnd("Running Report");
    return response;
}

function processReports(response: any) {
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





