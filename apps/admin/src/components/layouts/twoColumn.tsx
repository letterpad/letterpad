"use client";

import classNames from "classnames";
import React from "react";
import { TwoColumnLayout as Layout, useResponsiveLayout } from "ui";

import { Sidebar } from "@/components/sidebar";
import { TopBar } from "@/components/top-bar";

import Footer from "../website/Footer";

export const TwoColumnLayout = ({ children }) => {
  const { sidebarVisible, isDesktop } = useResponsiveLayout();
  return (
    <Layout
      left={<Sidebar />}
      right={
        <div
          className={classNames("top-0 flex flex-col px-4 md:px-6 flex-1", {
            "w-screen": sidebarVisible && !isDesktop,
          })}
        >
          <TopBar />
          <div className="flex-1 font-paragraph">{children}</div>
          <Footer />
        </div>
      }
    />
  );
};
