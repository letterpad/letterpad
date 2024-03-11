"use client";
import Chart, { ChartConfiguration } from "chart.js/auto";
import { InferGetServerSidePropsType } from "next";
import Image from "next/image";
import { FC, useEffect, useRef, useState } from "react";
import { Content, useTheme } from "ui";
import { PageHeader } from "ui/isomorphic";
import "chartjs-adapter-dayjs-4/dist/chartjs-adapter-dayjs-4.esm";

import {
  CountryChart,
  DateRangeSelector,
  DeviceChart,
  PostsReadTable,
  ReferrerTable,
  TotalStats,
  UsersPerDayChart,
} from "@/components/analytics";
import { getDateRanges } from "@/components/analytics/utils";
import { UpgradeBanner } from "@/components/upgrade-plan-banner";

import { SessionData } from "@/graphql/types";

import {
  type ApiResponseData,
  DateRange,
  DateRangeEnum,
} from "../api/analytics/types";
import { useIsPaidMember } from "../../hooks/useIsPaidMember";
import { isMembershipFeatureActive } from "../../shared/utils";

type P = InferGetServerSidePropsType<any>;
interface Props {
  session: SessionData;
}
const Analytics: FC<P & Props> = () => {
  const isPaidMemeber = useIsPaidMember();
  const { theme } = useTheme();
  const isMember = isMembershipFeatureActive() && isPaidMemeber;
  const [data, setData] = useState<ApiResponseData>({
    device: [],
    data: [],
    referals: [],
    countries: [],
    total: null,
    sessionsPerDay: [],
    reads: [],
    allTimeReads: 0,
  });
  const [fetching, setFetching] = useState(true);
  const chartContainer = useRef<HTMLCanvasElement>(null);
  const deviceContainer = useRef<HTMLCanvasElement>(null);
  const countryContainer = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<Chart<"bar">>();
  const deviceInstance = useRef<Chart<"pie">>();
  const countryInstance = useRef<Chart<"bar">>();

  const [dateRange, setDateRange] = useState<DateRange>(
    getDateRanges(DateRangeEnum.last7Days)
  );

  const doFetch = () => {
    if (!isMember) {
      return;
    }
    setFetching(true);
    const day = 1 / 4;
    fetch(
      "/api/analytics?" + new URLSearchParams(dateRange as any).toString(),
      {
        cache: "no-cache",
        headers: {
          "Content-Type": "application/json",
          // "Cache-Control": `max-age=${60 * 60 * 24 * day}`,
        },
      }
    )
      .then((res) => res.json())
      .then((res) => {
        if (res) {
          setData(res);
        }
      })
      .then(() => setFetching(false))
      .catch(() => setFetching(false));
  };

  useEffect(doFetch, [dateRange, isMember]);

  useEffect(() => {
    if (!data?.sessionsPerDay) return;
    if (chartContainer.current) {
      // Destroy existing chart to prevent memory leaks
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
      // Extract dates and page views from data
      const dates = data.sessionsPerDay?.map((entry) => entry.date);
      const pageViews = data.sessionsPerDay?.map((entry) => entry.sessions);

      const ctx = chartContainer.current.getContext("2d");
      if (ctx) {
        const chartConfig: ChartConfiguration<"bar"> = {
          type: "bar",
          data: {
            labels: dates,
            datasets: [
              {
                label: "Sessions",
                backgroundColor:
                  theme === "dark" ? "rgb(255, 99, 132)" : "rgb(75, 192, 192)",
                data: pageViews,
                borderColor:
                  theme === "dark" ? "rgb(255, 99, 132)" : "rgb(75, 192, 192)",
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

        chartInstance.current = new Chart(ctx, chartConfig);
      }
    }

    // Cleanup function
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [data?.sessionsPerDay, theme]);

  useEffect(() => {
    if (!data?.device) return;
    if (deviceContainer.current) {
      // Destroy existing chart to prevent memory leaks
      if (deviceInstance.current) {
        deviceInstance.current.destroy();
      }

      // Extract dates and page views from data
      // Extract labels and data values from the data
      const labels = data.device.map((item) => item.device);
      const values = data.device.map((item) => item.sessions);

      const ctx = deviceContainer.current.getContext("2d");
      if (ctx) {
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
            scales: {
              y: {
                ticks: {
                  display: false,
                  color: theme === "dark" ? "#36445f" : "#eee",
                },
                grid: {
                  display: false,
                },
              },
              x: {
                ticks: {
                  display: false,
                  color: theme === "dark" ? "#36445f" : "#eee",
                },
                grid: {
                  display: false,
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

        deviceInstance.current = new Chart(ctx, chartConfig);
      }
    }

    // Cleanup function
    return () => {
      if (deviceInstance.current) {
        deviceInstance.current.destroy();
      }
    };
  }, [data?.device, theme]);

  useEffect(() => {
    if (!data?.countries) return;
    if (countryContainer.current) {
      // Destroy existing chart to prevent memory leaks
      if (countryInstance.current) {
        countryInstance.current.destroy();
      }

      const countryNames = data.countries.map((country) => country.country);
      const sessions = data.countries.map((country) => country.sessions);

      const ctx = countryContainer.current.getContext("2d");
      if (ctx) {
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
                display: false,
              },
            },
          },
        };

        countryInstance.current = new Chart(ctx, chartConfig);
      }
    }

    // Cleanup function
    return () => {
      if (countryInstance.current) {
        countryInstance.current.destroy();
      }
    };
  }, [data?.countries, theme]);

  const display =
    isMember &&
    (fetching || (data?.total && Number(data.total.Sessions?.value) >= 1));
  return (
    <>
      <PageHeader className="site-page-header" title="Analytics">
        <span className="help-text">
          Here you will find insights of your blog.
        </span>
      </PageHeader>
      <Content>
        {!fetching && <UpgradeBanner />}
        {!fetching && !isMember && (
          <div className="hidden md:block relative w-full h-[100vh]">
            <Image
              src="/images/analytics.png"
              alt="Analytics"
              fill={true}
              objectFit="contain"
            />
          </div>
        )}
        {isMember && (
          <div className="relative">
            <div className="flex justify-end py-4 sticky">
              <DateRangeSelector onChange={setDateRange} />
            </div>
          </div>
        )}
        <div className="pb-20">
          {display && data ? (
            <div className="min-w-0 gap-2 flex flex-col">
              <div className="min-w-0 gap-2 flex flex-col">
                <TotalStats
                  data={data.total}
                  loading={fetching}
                  allTimeReads={data.allTimeReads}
                />
                <hr className="h-px my-8 bg-gray-200 border-0 dark:bg-gray-700"></hr>
                <div className="justify-center py-10 grid md:grid-cols-2 grid-cols-1 gap-10 md:gap-2">
                  <UsersPerDayChart ref={chartContainer} loading={fetching} />
                  <DeviceChart ref={deviceContainer} loading={fetching} />
                </div>
                <hr className="h-px my-8 bg-gray-200 border-0 dark:bg-gray-700"></hr>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <ReferrerTable data={data.referals} loading={fetching} />
                  <CountryChart ref={countryContainer} loading={fetching} />
                </div>
                <hr className="h-px my-8 bg-gray-200 border-0 dark:bg-gray-700"></hr>
                <PostsReadTable data={data.data} loading={fetching} />
              </div>
            </div>
          ) : (
            <span className="dark:text-gray-400 text-gray-700">
              {isMember && "There is not enough data to display metrics."}
            </span>
          )}
        </div>
      </Content>
    </>
  );
};

export default Analytics;
