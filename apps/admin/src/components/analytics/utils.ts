import dayjs, { Dayjs } from "dayjs";

import { DateRange, DateRangeEnum } from "../../app/api/analytics/types";

export const getDateRanges = (value: DateRangeEnum): DateRange => {
    const today = dayjs();
    let startDate: Dayjs,
        endDate: Dayjs,
        prevStartDate: Dayjs,
        prevEndDate: Dayjs;

    switch (value) {
        case DateRangeEnum.today:
            startDate = today;
            endDate = today;
            prevStartDate = today.subtract(2, "day");
            prevEndDate = today.subtract(1, "day");
            break;
        case DateRangeEnum.yesterday:
            startDate = today.subtract(1, "day");
            endDate = today.subtract(1, "day");
            prevStartDate = today.subtract(2, "day");
            prevEndDate = today.subtract(2, "day");
            break;
        case DateRangeEnum.last7Days:
            startDate = today.subtract(7, "day");
            endDate = today.subtract(1, "day");
            prevStartDate = dayjs(startDate).subtract(7, "day");
            prevEndDate = dayjs(startDate).subtract(1, "day");
            break;
        case DateRangeEnum.last30Days:
            startDate = today.subtract(30, "day");
            endDate = today.subtract(1, "day");
            prevStartDate = dayjs(startDate).subtract(30, "day");
            prevEndDate = dayjs(startDate).add(1, "day");
            break;
        case DateRangeEnum.last90Days:
            startDate = today.subtract(90, "day");
            endDate = today.subtract(1, "day");
            prevStartDate = dayjs(startDate).subtract(90, "day");
            prevEndDate = dayjs(startDate).subtract(1, "day");
            break;
        default:
            startDate = endDate = dayjs();
            prevStartDate = prevEndDate = dayjs();
            break;
    }

    return {
        startDate: startDate.format("YYYY-MM-DD"),
        endDate: endDate.format("YYYY-MM-DD"),
        prevStartDate: prevStartDate.format("YYYY-MM-DD"),
        prevEndDate: prevEndDate.format("YYYY-MM-DD"),
    };
};
