/* eslint-disable no-console */
import { BetaAnalyticsDataClient } from '@google-analytics/data';
import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma"

import { getServerSession } from "@/graphql/context";

import { reportCountry, reportDevice, reportReferral, reportViewPerPage, totalAll } from './reportQuery';
import { processCountryData, processReferralData, processReportData, processTotalData } from './utils';
import { getRootUrl } from '../../../shared/getRootUrl';

const analyticsDataClient = new BetaAnalyticsDataClient();


export async function GET(req: Request) {
    const dateRanges = getDateRanges();
    const prevDateRanges = getPrevDateRanges();
    const response = await runReport(dateRanges, prevDateRanges);
    const { data, referals, countries, total } = processReports(response);

    return NextResponse.json({ total, data, referals, countries, device: [] });
}

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





