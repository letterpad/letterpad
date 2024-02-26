"use client";

import React from "react";
import { TwoColumnLayout as Layout } from "ui";

import { Sidebar } from "@/components/sidebar";
import { TopBar } from "@/components/top-bar";

import Footer from "../website/Footer";

export const TwoColumnLayout = ({ children }) => {
  return (
    <Layout
      left={<Sidebar />}
      right={
        <div className="flex h-screen flex-col justify-between px-4 md:px-6">
          <TopBar />
          <div className="mb-auto">{children}</div>
          <Footer />
        </div>
      }
    />
  );
};
