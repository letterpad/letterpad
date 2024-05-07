import { IoRocketOutline } from "@react-icons/all-files/io5/IoRocketOutline";
import { cookies } from "next/headers";
import { Suspense } from "react";

import { AnnouncementPlaceholder, Announcements } from "./announcement";
import { BannerAd } from "./banner/bannerAd";
import { InView } from "./inView";
import { HomeLayout } from "./layout";
import { RenderCards, RenderCardsPlaceholder } from "./renderCards";
import { Topics, TopicsPlaceholder } from "./topics";
import { Trending, TrendingPlaceholder } from "./trending";

export const Website = async () => {
  const isControl = cookies().get("trendingPosition")?.value === "control";

  const variation = {
    FirstBlock: (
      <Suspense fallback={<TrendingPlaceholder />}>
        <Trending />
      </Suspense>
    ),
    ThirdBlock: <BannerAd />,
  };
  const control = {
    ThirdBlock: (
      <Suspense fallback={<TrendingPlaceholder />}>
        <Trending />
      </Suspense>
    ),
    FirstBlock: <BannerAd />,
  };
  const activeView = isControl ? control : variation;
  return (
    <HomeLayout
      SecondBlockMobileOnly={
        <InView>
          <Suspense fallback={<TopicsPlaceholder />}>
            <div className="font-bold text-lg mb-4 font-heading flex items-center gap-2">
              <IoRocketOutline className="text-sky-500" />
              Topics
            </div>
            <Topics limit={8} />
          </Suspense>
        </InView>
      }
      {...activeView}
      Content={
        <InView className="w-full mb-5 flex flex-col md:pr-10 gap-4 md:gap-8">
          <Suspense fallback={<RenderCardsPlaceholder />}>
            <RenderCards />
          </Suspense>
        </InView>
      }
      SidebarBlock1={
        <InView>
          <Suspense fallback={<AnnouncementPlaceholder />}>
            <Announcements />
          </Suspense>
        </InView>
      }
      SidebarBlock2={
        <Suspense fallback={<TopicsPlaceholder />}>
          <InView>
            <h4 className="font-bold text-md pb-4 font-heading flex items-center gap-2">
              <IoRocketOutline className="text-sky-500" />
              Topics
            </h4>
            <Topics limit={8} />
          </InView>
        </Suspense>
      }
    />
  );
};
