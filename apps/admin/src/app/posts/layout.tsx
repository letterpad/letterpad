"use client";
import React from "react";
import { TwoColumnLayout } from "ui";

import { SiteFooter } from "../../components/layouts/site-footer";
import { Sidebar } from "../../components/sidebar";
import { TopBar } from "../../components/top-bar";
import { DataContext, useDataProvider } from "../../context/DataProvider";
import { usePostsQuery } from "../../graphql/queries/queries.graphql";
import { SortBy } from "../../../__generated__/__types__";

export const dynamic = "force-dynamic";
const Layout = (props) => {
  const dp = useDataProvider();
  const queryData = usePostsQuery({
    variables: { filters: { sortBy: SortBy.Desc } },
  });
  const { loading, data, error, refetch } = queryData;

  return (
    <TwoColumnLayout
      left={<Sidebar settings={dp?.settings} me={dp?.me} stats={dp?.stats} />}
      right={
        <div className="px-4 md:px-6">
          <TopBar />
          <DataContext.Provider value={{ posts: { ...queryData } }}>
            {props.children}
          </DataContext.Provider>

          <SiteFooter />
        </div>
      }
    />
  );
};

export default Layout;
