"use client";

import React from "react";
import { TwoColumnLayout as Layout } from "ui";

import { SiteFooter } from "@/components/layouts/site-footer";
import { Sidebar } from "@/components/sidebar";
import { TopBar } from "@/components/top-bar";

import { useDataProvider } from "@/context/DataProvider";

export const TwoColumnLayout = ({ children }) => {
  const data = useDataProvider();
  return (
    <Layout
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
