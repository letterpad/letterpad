import { MetricPlaceholder } from "ui";

import { ProcessedTotalData } from "../../app/api/analytics/types";

type TotalStatsDataValue = {
  value: number;
  positive: boolean;
  percentage?: number;
};

export type TotalStatsData = {
  [K in keyof ProcessedTotalData]: TotalStatsDataValue;
};

// secondsToMinutes
export function TotalStats({
  data,
  loading,
}: {
  data: TotalStatsData;
  loading: boolean;
}) {
  return (
    <div className="grid lg:grid-cols-4 grid-cols-2 gap-6 w-full max-w-4xl">
      {loading && [1, 2, 3, 4].map(() => <MetricPlaceholder />)}
      {!loading &&
        Object.keys(data).map((key) => {
          const metricKey = key as keyof TotalStatsData;
          return (
            <div className="flex items-center p-4 rounded" key={metricKey}>
              <div className="flex-grow flex flex-col ml-4">
                <span className="text-4xl font-bold dark:text-slate-200">
                  {data[metricKey].value}
                </span>
                <div className="flex items-center justify-start gap-4">
                  <span className="text-slate-600 dark:text-slate-300 text-sm">
                    {metricKey}
                  </span>
                  <span
                    className={`text-xs font-semibold ml-2 ${
                      data[metricKey].positive
                        ? "text-green-500"
                        : "text-red-500"
                    }`}
                  >
                    {data[metricKey].positive ? "+" : ""}
                    {data[metricKey].percentage?.toFixed(2)}%
                  </span>
                </div>
              </div>
            </div>
          );
        })}
    </div>
  );
}
