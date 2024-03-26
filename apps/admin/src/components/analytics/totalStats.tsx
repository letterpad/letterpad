import classNames from "classnames";
import { MetricPlaceholder } from "ui";

import { ProcessedTotalData } from "../../app/api/analytics/types";

type TotalStatsDataValue = {
  value: number | string;
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
  allTimeReads,
}: {
  data: TotalStatsData | null;
  loading: boolean;
  allTimeReads: number;
}) {
  return (
    <div className="grid lg:grid-cols-4 md:grid-cols-2 grid-cols-2 md:gap-6 w-full max-w-5xl">
      <div className="flex items-center p-4 rounded">
        <div className="flex-grow flex flex-col ml-4">
          <span className="text-4xl font-bold dark:text-slate-200">
            {allTimeReads}
          </span>
          <div className="flex items-center justify-start gap-4">
            <span className="text-slate-600 dark:text-slate-300 text-sm">
              All time reads
            </span>
          </div>
        </div>
      </div>
      {loading && [1, 2, 3].map((key) => <MetricPlaceholder key={key} />)}
      {!loading &&
        data &&
        Object.keys(data ?? {}).map((key) => {
          const metricKey = key as keyof TotalStatsData;
          const hasDiff = !!data[metricKey].percentage;
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
                    className={classNames("text-xs font-semibold ml-2", {
                      "text-green-500": data[metricKey].positive,
                      "text-red-500": !data[metricKey].positive,
                      hidden: !hasDiff,
                    })}
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
