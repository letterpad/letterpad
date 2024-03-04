export interface Row {
    dimensionValues?: { value: string }[];
    metricValues?: { value: string }[];
}

export interface ProcessedReportData {
    pagePath: string;
    pageTitle: string;
    pageViews: number;
    duration: number;
}

export interface ProcessedReportData1 {
    date: string;
    pageViews: number;
}

export interface ProcessedReferralData {
    referrer: string;
    views: number;
}

export interface ProcessedCountryData {
    country: string;
    views: number;
}
export interface ProcessedDeviceData {
    device: string;
    views: number;
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

export interface ApiResponseData {
    data: ProcessedReportData[];
    referals: ProcessedReferralData[];
    countries: ProcessedCountryData[];
    total: ProcessedTotalData | null;
    device: ProcessedDeviceData[];
    nextData: ProcessedReportData1[];
}

export interface DateRange {
    startDate: string;
    endDate: string;
    prevStartDate: string;
    prevEndDate: string;
}

export enum DateRangeEnum {
    today = "today",
    yesterday = "yesterday",
    last7Days = "last7Days",
    last30Days = "last30Days",
    last90Days = "last90Days",
}