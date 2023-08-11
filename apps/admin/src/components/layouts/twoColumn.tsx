"use client";

import React from "react";
import { TwoColumnLayout as Layout } from "ui";

import { SiteFooter } from "@/components/layouts/site-footer";
import { Sidebar } from "@/components/sidebar";
import { TopBar } from "@/components/top-bar";

export const TwoColumnLayout = ({ children }) => {
  return (
    <Layout
      left={<Sidebar />}
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
