import Head from "next/head";
import { PageHeader } from "ui/isomorphic";

import { Content } from "@/components/client-wrapper";

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

function Subscribers() {
  return (
    <>
      <Head>
        <title>Subscribers</title>
      </Head>
      <PageHeader className="site-page-header" title="Subscribers">
        <span className="help-text">
          Here you will find all the users subscribed to your blog.
        </span>
      </PageHeader>
      <Content></Content>
    </>
  );
}

export default Subscribers;
