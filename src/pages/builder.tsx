import { PageHeader } from "antd";
import { Content } from "antd/lib/layout/layout";
import Head from "next/head";
import { FC } from "react";

import { Layout } from "@/components/builder";
import { Row } from "@/components/builder/layouts/story-builder";

import { PageProps } from "@/types";

const Builder: FC<PageProps> = () => {
  return (
    <>
      <Head>
        <title>Builder</title>
      </Head>
      <PageHeader className="site-page-header" title="Builder">
        <span className="help-text">
          Here you will find the collection of images that you uploaded from
          your computer.
        </span>
      </PageHeader>
      <Content>
        <Layout Row={Row} />
      </Content>
    </>
  );
};
export default Builder;
