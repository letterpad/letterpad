import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Tag",
};

const Layout = ({ children }) => {
  return <div>{children}</div>;
};

export default Layout;
