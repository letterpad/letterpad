import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
dayjs.extend(duration);
import { ProcessedMetricData } from "./types";

export function secondsToMinutes(seconds: number) {
    const durationObject = dayjs.duration(seconds, "seconds");
    const minutes = durationObject.minutes();
    const remainingSeconds = durationObject.seconds();
    return `${minutes}m ${remainingSeconds}s`;
}

export function removeSearchParams(url?: string | null) {
    if (!url) return "Unknown"
    const u = new URL(url);
    return u.origin + u.pathname;
}

export function processMetricData(value?: string, prevValue?: string): ProcessedMetricData {
    const intValue = parseInt(value ?? "0");
    const prevIntValue = parseInt(prevValue ?? "0");
    return {
        value: intValue,
        prevValue: prevIntValue,
        diff: intValue - prevIntValue,
        percentage: prevIntValue === 0 ? 100 : ((intValue - prevIntValue) / prevIntValue) * 100,
        positive: (intValue - prevIntValue) > 0
    };
}