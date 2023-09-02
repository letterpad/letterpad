import { Metadata } from "next";
import React from "react";

import { TwoColumnLayout } from "@/components/layouts/twoColumn";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Settings | Letterpad",
};
const Layout = ({ children }) => {
  return <TwoColumnLayout>{children}</TwoColumnLayout>;
};

export default Layout;
