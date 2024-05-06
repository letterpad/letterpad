import { IoTrendingUpSharp } from "@react-icons/all-files/io5/IoTrendingUpSharp";
import { Author } from "letterpad-graphql";
import Link from "next/link";
import {
  EventAction,
  EventCategory,
  ProfileCard,
  Skeleton,
} from "ui/isomorphic";

import { getRootUrl } from "@/shared/getRootUrl";

import { ClickAndTrack } from "./click";
import { getTrendingPosts } from "./data";
import { getReadableDate } from "../../shared/utils";

export const Trending = async () => {
  const posts = await getTrendingPosts();
  return (
    <>
      <h2 className="text-lg font-semibold flex items-center gap-2">
        <IoTrendingUpSharp className="dark:text-sky-500 text-sky-500" />
        Trending
      </h2>
      <h4 className="mb-4">Stories trending on Letterpad</h4>
      <div className="flex flex-row justify-between md:gap-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-2 md:gap-10 w-full">
          {posts?.map((article) => {
            const author = isAuthor(article.author) ? article.author : null;
            const link = new URL(
              article.slug ?? "",
              author?.site_url!
            ).toString();
            const authorLink = new URL(
              `@${author?.username}`,
              getRootUrl()
            ).toString();

            return (
              <div key={article.id} className="flex mb-4 flex-col gap-2">
                <div className="flex items-center">
                  <img
                    src={article.cover_image.src?.replace(
                      "image/upload",
                      "image/upload/c_scale,w_200"
                    )}
                    loading="lazy"
                    alt={article.title}
                    className="w-20 h-24 rounded-lg mr-4 object-cover"
                  />
                  <div className="flex flex-col justify-between h-full py-1">
                    <div>
                      <ProfileCard
                        link={authorLink}
                        avatar={author?.avatar!}
                        name={author?.name!}
                        showProLabel={author?.is_paid_member!}
                        size="xs"
                      />
                      <ClickAndTrack
                        className="flex items-center gap-2 mb-2"
                        href={link}
                        target="_blank"
                        trackOptions={{
                          eventAction: EventAction.Click,
                          eventCategory: EventCategory.TrendingPosts,
                          eventLabel: article.title,
                        }}
                      >
                        <span className="text-base font-bold text-wrap break-words line-clamp-2 font-heading">
                          {article.title}
                        </span>
                      </ClickAndTrack>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {article.stats?.reading_time} •{" "}
                      {getReadableDate(new Date(article.publishedAt!))}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

function isAuthor(obj?: any): obj is Author {
  if (!obj) return false;
  return obj && obj.__typename === "Author";
}

export const TrendingPlaceholder = () => {
  const items = Array.from({ length: 6 });

  return (
    <>
      <Skeleton className="h-6 w-36 rounded-full" />
      <Skeleton className="h-4 w-2/3 rounded-full my-2" />
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-2 md:gap-10 w-full mt-6">
        {items.map((_, i) => (
          <div className="flex items-center space-x-4 my-2" key={i}>
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-3 w-1/2 rounded-full" />
              <Skeleton className="h-4 w-[250px] rounded-full" />
              <Skeleton className="h-4 w-[200px] rounded-full" />
              <Skeleton className="h-2 w-[50px] rounded-full" />
            </div>
          </div>
        ))}
      </div>
    </>
  );
};
