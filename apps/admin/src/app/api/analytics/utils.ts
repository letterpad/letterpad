import { processMetricData, removeSearchParams, secondsToMinutes } from "./helper";
import { ProcessedCountryData, ProcessedDeviceData, ProcessedReferralData, ProcessedReportData, ProcessedReportData1, ProcessedTotalData, Row } from "./types";

export function processReportData(report: { rows?: Row[] }): ProcessedReportData[] {
    return report?.rows?.map(row => ({
        pagePath: row.dimensionValues?.[0].value ?? "",
        pageTitle: row.dimensionValues?.[1].value ?? "",
        pageViews: parseInt(row.metricValues?.[0]?.value ?? "0"),
        duration: parseInt(row.metricValues?.[1]?.value ?? "0")
    })) || [];
}

export function processReportData1(report: { rows?: Row[] }): ProcessedReportData1[] {
    return report?.rows?.map(row => ({
        date: row.dimensionValues?.[0].value ?? "",
        pageViews: parseInt(row.metricValues?.[0]?.value ?? "0"),
    })) || [];
}

export function processReferralData(report: { rows?: Row[] }): ProcessedReferralData[] {
    return report?.rows?.map(row => ({
        referrer: removeSearchParams(row.dimensionValues?.[0].value),
        views: parseInt(row.metricValues?.[0].value ?? "0")
    })) || [];
}

export function processCountryData(report: { rows?: Row[] }): ProcessedCountryData[] {
    return report?.rows?.map(row => ({
        country: row.dimensionValues?.[0].value ?? "",
        views: parseInt(row.metricValues?.[0].value ?? "0")
    })) || [];
}

export function processDeviceData(report: { rows?: Row[] }): ProcessedDeviceData[] {
    return report?.rows?.map(row => ({
        device: row.dimensionValues?.[0].value ?? "",
        views: parseInt(row.metricValues?.[0].value ?? "0")
    })) || [];
}

export function processTotalData(report: { rows?: Row[] }, prevReport: { rows?: Row[] }): ProcessedTotalData[] {
    return report?.rows?.map((row, index) => {
        const prev = prevReport?.rows?.[index]?.metricValues;
        const current = row.metricValues;

        function getValues(index: number) {
            return processMetricData(current?.[index].value, prev?.[index].value);
        }

        const avgTime = getValues(3);
        return {
            "Users": getValues(0),
            "Sessions": getValues(1),
            "Bounce": getValues(2),
            "Avg. Time": {
                ...avgTime,
                value: secondsToMinutes(Number(avgTime.value ?? 0) / parseInt(row.metricValues?.[1].value ?? "0"))
            },
        }
    }) ?? [];
}


