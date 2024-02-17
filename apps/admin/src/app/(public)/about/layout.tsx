import { Metadata } from "next";
import React from "react";

import Header from "@/components/header/Header";

export const metadata: Metadata = {
  title: "Tag",
};

const Layout = async ({ children }) => {
  return (
    <>
      <div className="flex min-h-screen flex-col overflow-hidden dark:bg-gray-900 dark:text-gray-100 text-black/60">
        <Header />
        <Banner />
        <main className="grow">
          <div className="flex flex-row max-w-6xl mx-auto px-4 sm:px-6 md:gap-8">
            <section className="w-full mb-5 flex flex-col overflow-hidden">
              {children}
            </section>
          </div>
        </main>
      </div>
    </>
  );
};

export default Layout;

const Banner = () => {
  return (
    <div className="w-full py-20 bg-black text-white">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 justify-between flex-col md:flex-row flex md:items-center md:space-y-0 space-y-10">
        <div className="">
          <h2 className="text-3xl font-bold mb-4">About</h2>
          <p className="text-lg"></p>
        </div>
      </div>
    </div>
  );
};
