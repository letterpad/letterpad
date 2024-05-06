"use client";

import classNames from "classnames";
import React from "react";
import { TwoColumnLayout as Layout, useResponsiveLayout } from "ui";

import "../../../public/css/globals.css";
import "../../../public/css/theme-variables.css";
import "tippy.js/dist/tippy.css";

import { Sidebar } from "@/components/sidebar";
import { TopBar } from "@/components/top-bar";

import { fonts } from "../fonts/fonts";
import Footer from "../website_v2/Footer";

export const TwoColumnLayout = ({ children }) => {
  const { sidebarVisible, isDesktop } = useResponsiveLayout();
  return (
    <Layout
      className={classNames(
        fonts.paragraph.variable,
        fonts.code.variable,
        fonts.heading.variable,
        fonts.sans.variable
      )}
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
