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
    Bounce: ProcessedMetricData;
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