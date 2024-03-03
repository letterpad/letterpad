import dayjs, { Dayjs } from "dayjs";
import React, { useEffect, useState } from "react";

interface DateRange {
  startDate: string;
  endDate: string;
}
interface PrevDateRange {
  prevStartDate: string;
  prevEndDate: string;
}

export type AllDateRanges = DateRange | PrevDateRange;
interface Props {
  onChange: (dateRanges: AllDateRanges) => void;
}

export const DateRangeSelector: React.FC<Props> = ({ onChange }) => {
  const [selectedOption, setSelectedOption] = useState<string>("lastWeek");

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    setSelectedOption(value);

    onChange({
      ...getDateRanges(value),
      ...getPrevDateRanges(value),
    });
  };

  return (
    <select
      value={selectedOption}
      onChange={handleChange}
      className="dark:bg-slate-800 rounded-md dark:border-slate-900 border-slate-300 focus:ring-blue-600 focus:border-blue-600 text-sm"
    >
      <option value="today" selected={selectedOption === "today"}>
        Today
      </option>
      <option value="yesterday" selected={selectedOption === "yesterday"}>
        Yesterday
      </option>
      <option value="lastWeek" selected={selectedOption === "lastWeek"}>
        Last Week
      </option>
      <option value="lastMonth" selected={selectedOption === "lastMonth"}>
        Last Month
      </option>
      <option value="last3Months" selected={selectedOption === "last3Months"}>
        Last 3 Months
      </option>
    </select>
  );
};

const getDateRanges = (value): DateRange => {
  const today = dayjs();
  let startDate: Dayjs, endDate: Dayjs;

  switch (value) {
    case "today":
      startDate = today;
      endDate = today;
      break;
    case "yesterday":
      startDate = today.subtract(1, "day");
      endDate = today;
      break;
    case "lastWeek":
      startDate = today.subtract(1, "week");
      endDate = today;
      break;
    case "lastMonth":
      startDate = today.subtract(1, "month");
      endDate = today;
      break;
    case "last3Months":
      startDate = today.subtract(3, "month");
      endDate = today;
      break;
    default:
      startDate = endDate = dayjs();
      break;
  }

  return {
    startDate: startDate.format("YYYY-MM-DD"),
    endDate: endDate.format("YYYY-MM-DD"),
  };
};

const getPrevDateRanges = (value?: string): PrevDateRange => {
  const today = dayjs();
  const currentRange = getDateRanges(value);
  let startDate: Dayjs, endDate: Dayjs;

  switch (value) {
    case "today":
      startDate = today.subtract(2, "day");
      endDate = today.subtract(1, "day");
      break;
    case "yesterday":
      startDate = today.subtract(3, "day");
      endDate = today.subtract(2, "day");
      break;
    case "lastWeek":
      startDate = dayjs(currentRange.startDate)
        .subtract(2, "week")
        .subtract(1, "day");
      endDate = dayjs(currentRange.startDate).subtract(1, "day");
      break;
    case "lastMonth":
      startDate = dayjs(currentRange.startDate)
        .subtract(1, "month")
        .subtract(1, "day");
      endDate = dayjs(currentRange.startDate).subtract(1, "day");
      break;
    case "last3Months":
      startDate = dayjs(currentRange.startDate)
        .subtract(3, "month")
        .subtract(1, "day");
      endDate = dayjs(currentRange.startDate).subtract(1, "day");
      break;
    default:
      startDate = endDate = dayjs();
      break;
  }

  return {
    prevStartDate: startDate.format("YYYY-MM-DD"),
    prevEndDate: endDate.format("YYYY-MM-DD"),
  };
};
