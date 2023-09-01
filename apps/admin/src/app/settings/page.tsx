import Head from "next/head";
import React from "react";
import { PageHeader } from "ui/isomorphic";

import { Content } from "@/components/client-wrapper";

import { Settings } from "./_feature/feature";

const Page = async () => {
  const cloudinaryEnabledByAdmin = !!(
    process.env.CLOUDINARY_KEY &&
    process.env.CLOUDINARY_NAME &&
    process.env.CLOUDINARY_SECRET
  );

  return (
    <>
      <Head>
        <title>Settings</title>
      </Head>
      <PageHeader className="site-page-header" title="Settings">
        <span className="help-text">
          Here you can customize your blog&apos;s settings.
        </span>
      </PageHeader>
      <Content>
        <Settings cloudinaryEnabledByAdmin={cloudinaryEnabledByAdmin} />
      </Content>
    </>
  );
};

export default Page;
