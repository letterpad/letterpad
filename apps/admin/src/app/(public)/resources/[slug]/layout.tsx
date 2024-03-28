import { Metadata } from "next";
import React, { FC } from "react";

import { Banner } from "@/components/website_v2/banner/banner";

import { fetchResource } from "@/resourceFetcher";

export const metadata: Metadata = {
  title: "Tag",
};

interface Props {
  params: { slug: string };
  children: React.ReactNode;
}
const Layout: FC<Props> = async ({ children, params }) => {
  const post = await fetchResource(params.slug);
  return (
    <>
      <div className="flex min-h-screen flex-col overflow-hidden ">
        <Banner title={post.title} description={post.sub_title} />
        <main className="grow">
          <div className="flex flex-row max-w-6xl mx-auto px-4 sm:px-0 md:gap-8">
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
