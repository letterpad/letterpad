"use client";
import {
  Legend,
  LinearScale,
  PointElement,
  TimeScale,
  Tooltip,
} from "chart.js";
import Chart, { ChartConfiguration } from "chart.js/auto";
import { InferGetServerSidePropsType } from "next";
import Image from "next/image";
import { FC, useEffect, useMemo, useState } from "react";
import { Bar, Pie } from "react-chartjs-2";
import { Content, useTheme } from "ui";
import { PageHeader } from "ui/isomorphic";
import "chartjs-adapter-dayjs-4/dist/chartjs-adapter-dayjs-4.esm";

import {
  DateRangeSelector,
  PostsReadTable,
  ReferrerTable,
  TotalStats,
} from "@/components/analytics";
import { getDateRanges } from "@/components/analytics/utils";
import { UpgradeBanner } from "@/components/upgrade-plan-banner";

import { SessionData } from "@/graphql/types";

Chart.register(LinearScale, PointElement, Tooltip, Legend, TimeScale);
import classNames from "classnames";
import { CgSpinner } from "react-icons/cg";
import { CiWarning } from "react-icons/ci";

import {
  type ApiResponseData,
  DateRange,
  DateRangeEnum,
} from "../api/analytics/types";
import { useIsPaidMember } from "../../../hooks/useIsPaidMember";

type P = InferGetServerSidePropsType<any>;
interface Props {
  session: SessionData;
}

const Analytics: FC<P & Props> = () => {
  const isPaidMember = useIsPaidMember();
  const { theme } = useTheme();
  const [data, setData] = useState<ApiResponseData>();
  const [fetching, setFetching] = useState(false);

  const [dateRange, setDateRange] = useState<DateRange>(
    getDateRanges(DateRangeEnum.last7Days)
  );

  useEffect(() => {
    // setData(testData);
  }, []);

  const doFetch = () => {
    setFetching(true);
    const day = 1 / 4;
    fetch(
      "/api/analytics?" + new URLSearchParams(dateRange as any).toString(),
      {
        cache: "force-cache",
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": `max-age=${60 * 60 * 24 * day}`,
        },
      }
    )
      .then((res) => res.json())
      .then((res) => {
        if (res) {
          if (res?.reads.length > 0) setData(res);
          else setData(null);
        }
      })
      .then(() => setFetching(false))
      .catch(() => setFetching(false));
  };

  useEffect(doFetch, [dateRange, isPaidMember]);

  const chartData = useMemo(() => {
    if (!data?.sessionsPerDay) return null;

    const dates = data.sessionsPerDay?.map((entry) => entry.date);
    const pageViews = data.sessionsPerDay?.map((entry) => entry.sessions);

    const chartConfig: ChartConfiguration<"bar"> = {
      type: "bar",
      data: {
        labels: dates,
        datasets: [
          {
            label: "Visits",
            backgroundColor: theme === "dark" ? "#3494ce" : "rgb(75, 192, 192)",
            data: pageViews,
            borderColor: theme === "dark" ? "#3494ce" : "rgb(75, 192, 192)",
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: true,
            labels: {
              color: theme === "dark" ? "#eee" : "#333",
            },
          },
        },
        scales: {
          x: {
            ticks: {
              color: theme === "dark" ? "#eee" : "#333",
            },
            type: "time",
            time: {
              unit: "day",
              displayFormats: {
                day: "MMM D",
              },
            },
            title: {
              display: true,
              text: "Date",
              color: theme === "dark" ? "#eee" : "#333",
            },
            grid: {
              color: theme === "dark" ? "#36445f" : "#eee",
            },
          },
          y: {
            ticks: {
              color: theme === "dark" ? "#eee" : "#333",
              stepSize: 1,
            },
            title: {
              display: true,
              text: "Sessions",
              color: theme === "dark" ? "#eee" : "#333",
            },
            grid: {
              color: theme === "dark" ? "#36445f" : "#eee",
            },
          },
        },
      },
    };

    return chartConfig;
  }, [data?.sessionsPerDay, theme]);

  const deviceData = useMemo(() => {
    if (!data?.device) {
      return null;
    }

    const labels = data.device.map((item) => item.device);
    const values = data.device.map((item) => item.sessions);

    const chartConfig: ChartConfiguration<"pie"> = {
      type: "pie",
      data: {
        labels: labels,
        datasets: [
          {
            label: "sessions by Device",
            data: values,
            backgroundColor: [
              "rgba(49, 137, 106, 0.8)",
              "rgba(54, 162, 235, 0.5)",
              "rgba(255, 206, 86, 0.5)",
            ],
            borderColor: [
              "rgba(49, 137, 106, 1)",
              "rgba(54, 162, 235, 1)",
              "rgba(255, 206, 86, 1)",
            ],
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: true,
            labels: {
              color: theme === "dark" ? "#eee" : "#333",
            },
          },
        },
      },
    };
    return chartConfig;
  }, [data?.device, theme]);

  const countryData = useMemo(() => {
    if (!data?.countries) return null;

    const countryNames = data.countries.map((country) => country.country);
    const sessions = data.countries.map((country) => country.sessions);

    const chartConfig: ChartConfiguration<"bar"> = {
      type: "bar",
      data: {
        labels: countryNames,
        datasets: [
          {
            label: "Sessions",
            data: sessions,
            backgroundColor: "rgba(54, 162, 235, 0.5)", // Blue color
            borderColor: "rgba(54, 162, 235, 1)",
            borderWidth: 1,
          },
        ],
      },
      options: {
        indexAxis: "y",
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            ticks: {
              color: theme === "dark" ? "#eee" : "#333",
            },
            grid: {
              color: theme === "dark" ? "#36445f" : "#eee",
            },
          },
          x: {
            ticks: {
              color: theme === "dark" ? "#eee" : "#333",
            },
            grid: {
              color: theme === "dark" ? "#36445f" : "#eee",
            },
          },
        },
        plugins: {
          legend: {
            display: true,
            labels: {
              color: theme === "dark" ? "#eee" : "#333",
            },
          },
        },
      },
    };
    return chartConfig;
  }, [data?.countries, theme]);

  const noData = !fetching && !data;
  const hasData = data && !fetching;
  return (
    <>
      <PageHeader className="site-page-header" title="Analytics">
        <span className="help-text">
          Here you will find insights of your blog.
        </span>
      </PageHeader>
      <Content>
        <UpgradeBanner />
        <div className="relative">
          <div className="flex justify-end py-4 sticky">
            <DateRangeSelector onChange={setDateRange} />
          </div>
        </div>

        <div className="pb-20">
          {fetching && <CgSpinner className="animate-spin w-8 h-8" />}
          {noData && (
            <div className="flex items-center  gap-2 rounded dark:text-gray-200 text-gray-700 border border-slate-700 py-6 px-4 bg-slate-800">
              <CiWarning size={20} /> There is not enough data to display
              metrics. Please check back later.
            </div>
          )}
          {hasData && (
            <div className="min-w-0 gap-2 flex flex-col">
              <div className="min-w-0 space-y-20 flex flex-col">
                <TotalStats
                  data={data.total}
                  loading={fetching}
                  allTimeReads={data.allTimeReads}
                />
                {isPaidMember ? (
                  <>
                    <Divider />
                    <div className="flex flex-col lg:flex-row gap-8 md:gap-4">
                      <div className="flex md:justify-center flex-auto min-h-60 md:min-h-0 min-w-0 flex-col">
                        <h1 className="text-md font-bold text-center py-4">
                          Visits per day
                        </h1>
                        <div className="w-screen lg:w-[calc(50vw-250px)] h-80 relative px-20 lg:px-0">
                          {chartData && <Bar {...chartData} />}
                        </div>
                      </div>
                      <div className="flex md:justify-center flex-auto min-h-50 md:min-h-0 min-w-0">
                        <div className="w-screen lg:w-[calc(50vw-250px)] h-72 relative">
                          <h1 className="text-md font-bold text-center py-4">
                            Visits per device
                          </h1>
                          {deviceData && <Pie {...deviceData} />}
                        </div>
                      </div>
                    </div>
                    <Divider className="hidden lg:block" />
                    <div className="flex flex-col lg:flex-row gap-10">
                      <div className="flex md:justify-center flex-auto min-h-60 md:min-h-0 min-w-0">
                        <div className="w-screen lg:w-[calc(50vw-250px)] h-80 relative">
                          <h1 className="text-md font-bold text-center py-4">
                            Referring sites
                          </h1>
                          <ReferrerTable
                            data={data.referals}
                            loading={fetching}
                          />
                        </div>
                      </div>

                      <div className="flex md:justify-center flex-auto min-h-60 md:min-h-0 min-w-0 flex-col">
                        <h1 className="text-md font-bold text-center py-4">
                          Visits per country
                        </h1>
                        <div className="w-screen lg:w-[calc(50vw-250px)] h-80 relative">
                          {countryData && <Bar {...countryData} />}
                        </div>
                      </div>
                    </div>
                    <Divider className="hidden lg:block" />
                    <div>
                      <h1 className="text-md font-bold text-center py-4">
                        Posts statistics
                      </h1>
                      <PostsReadTable data={data.data} loading={fetching} />
                    </div>
                  </>
                ) : (
                  <div className="hidden md:block relative w-full h-[100vh]">
                    <Image
                      src="/images/analytics.png"
                      alt="Analytics"
                      fill={true}
                      style={{ objectFit: "cover" }}
                    />
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </Content>
    </>
  );
};

export default Analytics;

const Divider: FC<{ className?: string }> = ({ className }) => (
  <hr
    className={classNames(
      "h-px bg-gray-200 border-0 dark:bg-gray-700",
      className
    )}
  ></hr>
);
