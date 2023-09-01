import { Metadata } from "next";
import React from "react";

import { TwoColumnLayout } from "@/components/layouts/twoColumn";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Media | Letterpad",
  description: "This is where you will find all your media",
};
const Layout = ({ children }) => {
  return <TwoColumnLayout>{children}</TwoColumnLayout>;
};

export default Layout;
