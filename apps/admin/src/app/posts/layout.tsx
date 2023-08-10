import React from "react";

import { TwoColumnLayout } from "@/components/layouts/twoColumn";

export const dynamic = "force-dynamic";

const Layout = ({ children, ...rest }) => {
  return <TwoColumnLayout>{children}</TwoColumnLayout>;
};

export default Layout;
