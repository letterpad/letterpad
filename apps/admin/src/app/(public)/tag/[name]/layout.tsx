import { Metadata } from "next";
import Link from "next/link";
import React from "react";

import Header from "@/components/header/Header";
import { Banner } from "@/components/website_v2/banner/banner";
import { getLetterpadCategories } from "@/components/website_v2/data";

import { replaceLpTopicTagPrefix } from "@/shared/utils";

export const metadata: Metadata = {
  title: "Tag",
};

const Layout = async ({ children, ...p }) => {
  const categories = await getLetterpadCategories();
  const tag = decodeURIComponent(replaceLpTopicTagPrefix(p.params.name));
  return (
    <>
      <div className="flex min-h-screen flex-col overflow-hidden dark:bg-gray-950 dark:text-gray-100 text-black/60">
        <Header />
        <Banner
          title={
            <>
              Posts tagged with{" "}
              <span className={"font-body " + getTailwindColorClass(tag)}>
                {tag}
              </span>
            </>
          }
          description=""
        />
        <main className="grow">
          <div className="flex flex-row max-w-6xl mx-auto px-4 sm:px-6 md:gap-8">
            <section className="w-full mb-5 flex flex-col overflow-hidden">
              {children}
            </section>
            <div className="hidden md:block md:ml-10 md:min-w-52 py-10">
              <section className="">
                <h3 className="font-bold text-lg pb-2">Topics</h3>
                <ul className="flex flex-col gap-2">
                  {categories?.popularTags?.rows?.map((category) => {
                    return (
                      <li className="text-md truncate" key={category.slug}>
                        <Link href={`${category.slug!}`}>{category.name}</Link>
                      </li>
                    );
                  })}
                </ul>
              </section>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default Layout;

function getTailwindColorClass(keyword: string) {
  const colors = [
    "text-red-600",
    "text-red-400",
    "text-orange-600",
    "text-orange-400",
    "text-yellow-600",
    "text-green-600",
    "text-green-400",
    "text-teal-600",
    "text-teal-400",
    "text-blue-600",
    "text-blue-400",
    "text-indigo-600",
    "text-purple-600",
    "text-purple-400",
    "text-pink-600",
  ];

  // Convert keyword to a numeric value
  let hash = 0;
  for (let i = 0; i < keyword.length; i++) {
    hash = keyword.charCodeAt(i) + ((hash << 5) - hash);
  }

  // Map the numeric value to a color
  const index = Math.abs(hash) % colors.length;
  return colors[index];
}
