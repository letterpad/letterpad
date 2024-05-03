import { Metadata } from "next";
import React from "react";

import Header from "@/components/header/Header";
import Footer from "@/components/website_v2/Footer";

export const metadata: Metadata = {
  title: "Topics",
};

const Layout = async ({ children }) => {
  return (
    <>
      <div className="flex min-h-screen flex-col space-y-8 overflow-hidden dark:bg-gray-950 dark:text-gray-100 text-black/60">
        <Header />
        <main className="grow">
          <div className="flex flex-row max-w-6xl mx-auto px-4 sm:px-6 md:gap-8">
            <section className="w-full mb-5 flex flex-col overflow-hidden">
              {children}
            </section>
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Layout;
