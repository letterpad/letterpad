import { runReport1, runReport2 } from "./route";

export interface Row {
    dimensionValues?: { value: string }[];
    metricValues?: { value: string }[];
}

export interface ProcessedReportData {
    pagePath: string;
    pageTitle: string;
    pageViews: number;
    duration: number;
    engagementRate: string;
}

export interface ProcessedSessionsPerDayData {
    date: string;
    sessions: number;
}

export interface ProcessedReferralData {
    referrer: string;
    sessions: number;
}

export interface ProcessedCountryData {
    country: string;
    sessions: number;
}
export interface ProcessedDeviceData {
    device: string;
    sessions: number;
}

export interface ProcessedTotalData {
    Users: ProcessedMetricData;
    Sessions: ProcessedMetricData;
    "New Users": ProcessedMetricData;
    "Avg. Time": ProcessedMetricData;
}

export interface ProcessedMetricData {
    value: number | string;
    prevValue: number;
    diff: number;
    percentage: number;
    positive: boolean;
}

export type ApiResponseData = Awaited<ReturnType<typeof runReport2>> & Awaited<ReturnType<typeof runReport1>>;

export interface DateRange {
    startDate: string;
    endDate: string;
    prevStartDate: string;
    prevEndDate: string;
}

export enum DateRangeEnum {
    today = "today",
    yesterday = "yesterday",
    last3Days = "last3Days",
    last7Days = "last7Days",
    last30Days = "last30Days",
    last90Days = "last90Days",
}