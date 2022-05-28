import React from "react";

import { formatLongNumber, formatShortTime } from "@/utils/format";

import MetricCard from "./MetricsCard";

interface DefaultValue {
  value: number;
  change: number;
}
interface Props {
  stats: {
    pageviews: DefaultValue;
    uniques: DefaultValue;
    bounces: DefaultValue;
    totaltime: DefaultValue;
  };
}
const MetricsBar: React.VFC<Props> = (data) => {
  const { pageviews, uniques, bounces, totaltime } = data.stats || {};
  const num = Math.min(data && uniques.value, data && bounces.value);
  const diffs = data && {
    pageviews: pageviews.value - pageviews.change,
    uniques: uniques.value - uniques.change,
    bounces: bounces.value - bounces.change,
    totaltime: totaltime.value - totaltime.change,
  };

  const formatFunc = (n) =>
    n >= 0 ? formatLongNumber(n) : `-${formatLongNumber(Math.abs(n))}`;
  return (
    <div style={{ overflowX: "auto", width: "100%", display: "flex" }}>
      <MetricCard
        label="Views"
        value={pageviews.value}
        change={pageviews.change}
        format={formatFunc}
      />
      <MetricCard
        label="Visitors"
        value={uniques.value}
        change={uniques.change}
        format={formatFunc}
      />
      <MetricCard
        label="Bounce rate"
        value={uniques.value ? (num / uniques.value) * 100 : 0}
        change={
          uniques.value && uniques.change
            ? (num / uniques.value) * 100 -
                (Math.min(diffs.uniques, diffs.bounces) / diffs.uniques) *
                  100 || 0
            : 0
        }
        format={(n) => Number(n).toFixed(0) + "%"}
        reverseColors
      />
      <MetricCard
        label="Average visit time"
        value={
          totaltime.value && pageviews.value
            ? totaltime.value / (pageviews.value - bounces.value)
            : 0
        }
        change={
          totaltime.value && pageviews.value
            ? (diffs.totaltime / (diffs.pageviews - diffs.bounces) -
                totaltime.value / (pageviews.value - bounces.value)) *
                -1 || 0
            : 0
        }
        format={(n) =>
          `${n < 0 ? "-" : ""}${formatShortTime(
            Math.abs(~~n),
            ["m", "s"],
            " ",
          )}`
        }
      />
    </div>
  );
};

export default MetricsBar;
