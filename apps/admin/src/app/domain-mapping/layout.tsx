"use client";
import React from "react";
import { TwoColumnLayout } from "ui";

import { SiteFooter } from "@/components/layouts/site-footer";
import { Sidebar } from "@/components/sidebar";
import { TopBar } from "@/components/top-bar";

import { DataContext, useDataProvider } from "@/context/DataProvider";

import { useDomainQuery } from "../../graphql/queries/queries.graphql";

export const dynamic = "force-dynamic";
const Layout = (props) => {
  const dp = useDataProvider();
  const queryData = useDomainQuery();

  return (
    <TwoColumnLayout
      left={<Sidebar settings={dp?.settings} me={dp?.me} stats={dp?.stats} />}
      right={
        <div className="px-4 md:px-6">
          <TopBar />
          <DataContext.Provider value={{ ...dp, domain: { ...queryData } }}>
            {props.children}
          </DataContext.Provider>

          <SiteFooter />
        </div>
      }
    />
  );
};

export default Layout;
