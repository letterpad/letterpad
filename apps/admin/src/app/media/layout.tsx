"use client";

import React from "react";

import { TwoColumnLayout } from "@/components/layouts/twoColumn";

export const dynamic = "force-dynamic";

const Layout = ({ children }) => {
  return <TwoColumnLayout>{children}</TwoColumnLayout>;
};

export default Layout;
