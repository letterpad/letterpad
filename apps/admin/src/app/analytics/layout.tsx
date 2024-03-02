"use client";

import React from "react";

import { TwoColumnLayout } from "@/components/layouts/twoColumn";

const Layout = ({ children }) => {
  return <TwoColumnLayout>{children}</TwoColumnLayout>;
};

export default Layout;
