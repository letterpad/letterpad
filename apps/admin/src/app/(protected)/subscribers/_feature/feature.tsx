"use client";

import { Table } from "ui/dist/index.mjs";

import ErrorMessage from "@/components/ErrorMessage";

import { useGetSubscribers } from "./client.api";

export const columns = [
  {
    title: "Email",
    dataIndex: "email",
    key: "email",
  },
  {
    title: "Verified",
    dataIndex: "verified",
    key: "verified",
    render: (verified: boolean) => {
      return <>{verified ? "Verified" : "Not Verified"}</>;
    },
  },
  {
    title: "Created At",
    dataIndex: "createdAt",
    key: "createdAt",
    render: (date: string) => {
      const d = new Date(date);
      const ye = new Intl.DateTimeFormat("en", { year: "2-digit" }).format(d);
      const mo = new Intl.DateTimeFormat("en", { month: "short" }).format(d);
      const da = new Intl.DateTimeFormat("en", { day: "2-digit" }).format(d);

      return (
        <span>
          {da} {mo}, {ye}
        </span>
      );
    },
  },
];

export const Feature = () => {
  const { data, error, fetching: loading } = useGetSubscribers();

  if (error) return <ErrorMessage description={error} title="Error" />;

  return (
    <>
      <Table
        columns={columns}
        dataSource={data?.subscribers.rows}
        loading={loading}
      />
    </>
  );
};
