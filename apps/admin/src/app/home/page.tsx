import Head from "next/head";
import { FC } from "react";
import { PageHeader } from "ui/isomorphic";

import { Content } from "@/components/client-wrapper";

import { Feature } from "@/app/home/_feature";

import { PageProps } from "@/types";

const Home: FC<PageProps> = ({ settings }) => {
  return (
    <>
      <Head>
        <title>Home</title>
      </Head>
      <PageHeader title="Welcome to your blog! 🎉" className="site-page-header">
        <span className="help-text">
          Thank you for trying out Letterpad. We encourage you to update the
          below information first. This will allow search engines to discover
          your site.
        </span>
      </PageHeader>
      <Content>
        <div
          style={{
            fontSize: "1rem",
            padding: "40px 20px",
            minHeight: "calc(100vh - 100px)",
            paddingBottom: 20,
            display: "flex",
            alignItems: "top",
            flexDirection: "column",
            justifyContent: "left",
            lineHeight: 1.6,
          }}
        >
          <Feature />
        </div>
      </Content>
    </>
  );
};
export default Home;
