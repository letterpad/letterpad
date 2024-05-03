import classNames from "classnames";
import { getServerSession } from "next-auth";
import { IoRocketOutline } from "react-icons/io5";

import { Announcements } from "./announcement";
import { BannerAd } from "./banner/bannerAd";
import { RenderCard } from "./card";
import {
  getfavAuthors,
  getLetterpadCategories,
  getLetterpadPosts,
} from "./data";
import { Divider } from "./divider";
import { Featured } from "./featured";
import { InfiniteList } from "./infinite-list";
import { Topics } from "./topics";
import { Aos } from "../../app/(public)/features/aos";
import { options } from "../../pages/api/auth/[...nextauth]";
import { fetchPostsByTag } from "../../resourceFetcher";

export const Website = async () => {
  const [data, categories, favAuthors, posts] = await Promise.all([
    getLetterpadPosts({ filters: { cursor: "" } }),
    getLetterpadCategories(),
    getfavAuthors(),
    fetchPostsByTag(),
  ]);
  const session = await getServerSession(options());
  const hasSession = !!session?.user?.id;
  const rows =
    data?.letterpadLatestPosts.__typename === "PostsNode"
      ? data.letterpadLatestPosts.rows
      : [];

  return (
    <>
      <div className="flex min-h-screen flex-col">
        <BannerAd hasSession={hasSession} />
        <Divider />
        <main className="grow space-y-16 py-8">
          <div className="z-10 md:hidden">
            <div className="mx-auto px-4 relative">
              <h4 className="font-bold text-lg pb-4 font-heading flex items-center gap-2">
                <IoRocketOutline className="text-sky-500" />
                Topics
              </h4>
              <Topics topics={categories?.popularTags?.rows!} limit={8} />
            </div>
          </div>
          <Divider className="md:hidden" />
          <div
            className="max-w-6xl mx-auto px-4 gap-4 flex flex-col"
            data-aos="fade-down"
            data-aos-easing="linear"
            data-aos-duration="200"
            data-aos-delay="200"
          >
            <Featured />
          </div>
          <Divider />
          <div className="flex flex-row max-w-6xl mx-auto px-4 divide-x-[1px] dark:divide-slate-800 divide-slate-200">
            <section className="w-full mb-5 flex flex-col md:pr-10 gap-4 md:gap-8">
              {rows.map((post) => (
                <RenderCard key={post.slug} post={post} />
              ))}
              <InfiniteList cursor={rows?.[rows.length - 1]?.id} />
            </section>
            <div
              className={classNames("hidden md:min-w-80  top-0  md:pl-10", {
                "md:block": posts?.length > 0 || favAuthors?.length > 0,
              })}
            >
              <div className="space-y-8 sticky top-10">
                <section
                  data-aos="zoom-in"
                  data-aos-easing="linear"
                  data-aos-duration="200"
                  className="border-sky-100 dark:border-sky-500/20 rounded-lg bg-brand/5 p-4 border"
                >
                  <Announcements posts={posts} />
                </section>

                <section
                  className="block max-w-md"
                  data-aos="zoom-in"
                  data-aos-easing="linear"
                  data-aos-duration="200"
                  data-aos-delay="100"
                >
                  <h4 className="font-bold text-md pb-4 font-heading flex items-center gap-2">
                    <IoRocketOutline className="text-sky-500" />
                    Topics
                  </h4>
                  <Topics topics={categories?.popularTags?.rows!} limit={8} />
                </section>
              </div>
            </div>
          </div>
        </main>
        <Aos />
      </div>
    </>
  );
};
