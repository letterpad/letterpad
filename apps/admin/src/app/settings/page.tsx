import Head from "next/head";
import React from "react";
import { PageHeader } from "ui/isomorphic";

import { getClient } from "@/lib/urql";

import { Content } from "@/components/client-wrapper";

import {
  HomeQueryDocument,
  HomeQueryQueryResult,
} from "@/__generated__/src/graphql/queries/queries.graphql";
import { Settings } from "@/features/settings/feature";

import { isSettings } from "../../utils/type-guards";

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
