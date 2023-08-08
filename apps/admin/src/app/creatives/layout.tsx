"use client";

import React from "react";
import { TwoColumnLayout } from "ui";

import { useDataProvider } from "@/context/DataProvider";

import { SiteFooter } from "../../components/layouts/site-footer";
import { Sidebar } from "../../components/sidebar";
import { TopBar } from "../../components/top-bar";

export const dynamic = "force-dynamic";

const Layout = ({ children }) => {
  const data = useDataProvider();
  return (
    <TwoColumnLayout
      left={
        <Sidebar settings={data?.settings} me={data?.me} stats={data?.stats} />
      }
      right={
        <div className="px-4 md:px-6">
          <TopBar />
          {children}
          <SiteFooter />
        </div>
      }
    />
  );
};

export default Layout;
