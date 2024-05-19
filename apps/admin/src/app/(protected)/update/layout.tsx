import { Metadata, Viewport } from "next";
import React from "react";

import { Logo } from "../../../components/auth/logo";
import Footer from "../../../components/website_v2/Footer";

export const metadata: Metadata = {
  title: "Onboarding",
  description: "Onboadring to Letterpad",
  robots: "follow, index",
};

export const viewport: Viewport = {
  themeColor: "black",
  width: "device-width",
};

const Layout = ({ children }) => {
  return (
    <div className="flex flex-col h-screen overflow-y-auto">
      <header>
        <h2 className="pt-16 flex justify-center text-4xl font-bold text-gray-700 dark:text-white">
          <Logo />
        </h2>
      </header>
      {children}
      <Footer />
    </div>
  );
};

export default Layout;
