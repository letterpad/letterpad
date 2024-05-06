import React, { useState } from "react";

import { getDateRanges } from "./utils";
import {
  DateRange,
  DateRangeEnum,
} from "../../app/(protected)/api/analytics/types";

interface Props {
  onChange: (dateRanges: DateRange) => void;
}

export const DateRangeSelector: React.FC<Props> = ({ onChange }) => {
  const [selectedOption, setSelectedOption] = useState<DateRangeEnum>(
    DateRangeEnum.last7Days
  );

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value as DateRangeEnum;
    setSelectedOption(value);

    onChange({
      ...getDateRanges(value),
    });
  };

  return (
    <select
      value={selectedOption}
      onChange={handleChange}
      className="dark:bg-slate-800 rounded-md dark:border-slate-900 border-slate-300 focus:ring-blue-600 focus:border-blue-600 text-sm"
    >
      <option value={DateRangeEnum.today}>Today</option>
      <option value={DateRangeEnum.yesterday}>Yesterday</option>
      <option value={DateRangeEnum.last3Days}>Last 3 days</option>
      <option value={DateRangeEnum.last7Days}>Last 7 days</option>
      <option value={DateRangeEnum.last30Days}>Last 30 days</option>
      <option value={DateRangeEnum.last90Days}>Last 90 days</option>
    </select>
  );
};
