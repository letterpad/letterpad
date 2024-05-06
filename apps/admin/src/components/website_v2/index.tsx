import { IoRocketOutline } from "@react-icons/all-files/io5/IoRocketOutline";
import classNames from "classnames";
import { getServerSession } from "next-auth";
import { Suspense } from "react";
import { Skeleton } from "ui/isomorphic";

import { AnnouncementPlaceholder, Announcements } from "./announcement";
import { BannerAd } from "./banner/bannerAd";
import { RenderCard } from "./card";
import { getLetterpadPosts } from "./data";
import { Divider } from "./divider";
import { InfiniteList } from "./infinite-list";
import { InView } from "./inView";
import { Topics, TopicsPlaceholder } from "./topics";
import { Trending, TrendingPlaceholder } from "./trending";

export const Website = async () => {
  return (
    <>
      <div className="flex min-h-screen flex-col">
        <BannerAd />
        <Divider />
        <main className="grow space-y-16 py-8">
          <div className="z-10 md:hidden">
            <div className="mx-auto px-4 relative">
              <InView>
                <Suspense fallback={<TopicsPlaceholder />}>
                  <div className="font-bold text-lg pb-4 font-heading flex items-center gap-2">
                    <IoRocketOutline className="text-sky-500" />
                    Topics
                  </div>
                  <Topics limit={8} />
                </Suspense>
              </InView>
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
            <InView>
              <Suspense fallback={<TrendingPlaceholder />}>
                <Trending />
              </Suspense>
            </InView>
          </div>
          <Divider />
          <div className="flex flex-row max-w-6xl mx-auto px-4 divide-x-[1px] dark:divide-slate-800 divide-slate-200">
            <InView className="w-full mb-5 flex flex-col md:pr-10 gap-4 md:gap-8">
              <Suspense fallback={<RenderCardsPlaceholder />}>
                <RenderCards />
              </Suspense>
            </InView>
            <div
              className={classNames(
                "hidden md:min-w-80 top-0  md:pl-10 md:block"
              )}
            >
              <div className="space-y-8 sticky top-10">
                <InView>
                  <Suspense fallback={<AnnouncementPlaceholder />}>
                    <Announcements />
                  </Suspense>
                </InView>

                <section
                  className="block max-w-md"
                  data-aos="zoom-in"
                  data-aos-easing="linear"
                  data-aos-duration="200"
                  data-aos-delay="100"
                >
                  <Suspense fallback={<TopicsPlaceholder />}>
                    <InView>
                      <h4 className="font-bold text-md pb-4 font-heading flex items-center gap-2">
                        <IoRocketOutline className="text-sky-500" />
                        Topics
                      </h4>
                      <Topics limit={8} />
                    </InView>
                  </Suspense>
                </section>
              </div>
            </div>
          </div>
        </main>
        {/* <Aos /> */}
      </div>
    </>
  );
};

const RenderCards = async () => {
  const data = await getLetterpadPosts({ filters: { cursor: "" } });
  const rows =
    data?.letterpadLatestPosts.__typename === "PostsNode"
      ? data.letterpadLatestPosts.rows
      : [];
  return (
    <>
      {rows?.map((post) => <RenderCard key={post.slug} post={post} />)}
      <InfiniteList cursor={rows?.[rows.length - 1]?.id} />
    </>
  );
};

const RenderCardsPlaceholder = async () => {
  const items = Array.from({ length: 3 });
  return (
    <div className="my-4">
      <ul className="flex gap-5 flex-col divide-y dark:divide-blue-500/30 divide-brand/10">
        {items.map((_, i) => (
          <div className="flex flex-row items-center justify-between" key={i}>
            <div className="flex flex-col">
              <div className="flex-1 md:w-1/2">
                <Skeleton className="w-full h-[300px] md:h-auto rounded-md" />
              </div>
              <div className="p-6 md:p-8 flex flex-col items-start gap-4 md:gap-6">
                <Skeleton className="h-8 w-[200px] rounded-md" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-[400px] rounded-md" />
                  <Skeleton className="h-4 w-[400px] rounded-md" />
                </div>
                <Skeleton className="h-9 w-[120px] rounded-md" />
              </div>
            </div>
            <Skeleton className=" w-[160px] h-40 rounded-md" />
          </div>
        ))}
      </ul>
    </div>
  );
};
