import { Author } from "letterpad-graphql";
import Link from "next/link";
import { IoStar } from "react-icons/io5";
import { ProfileCard, Skeleton } from "ui/isomorphic";

import { getRootUrl } from "@/shared/getRootUrl";

import { getFeaturedPosts } from "./data";
import { getReadableDate } from "../../shared/utils";

export const Featured = async () => {
  const posts = await getFeaturedPosts();
  return (
    <>
      <h2 className="text-lg font-semibold flex items-center gap-2">
        <IoStar className="dark:text-yellow-500 text-yellow-500" />
        Featured
      </h2>
      <h4 className="mb-4">
        Find new, handpicked stories you'll love, updated weekly.
      </h4>

      <div className="flex flex-row justify-between md:gap-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-2 md:gap-10 w-full">
          {posts.map((article) => {
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
                      <Link
                        className="flex items-center gap-2 mb-2"
                        href={link}
                        target="_blank"
                      >
                        <span className="text-base font-bold text-wrap break-words line-clamp-2 font-heading">
                          {article.title}
                        </span>
                      </Link>
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

export const FeaturedPlaceholder = () => {
  const items = Array.from({ length: 6 });
  return (
    <>
      <Skeleton className="h-6 w-36 rounded-full" />
      <Skeleton className="h-4 w-72 rounded-full" />
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-2 md:gap-10 w-full mt-6">
        {items.map((_, i) => (
          <div className="flex items-center space-x-4">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-3 w-[250px] rounded-full" />
              <Skeleton className="h-4 w-[250px] rounded-full" />
              <Skeleton className="h-4 w-[200px] rounded-full" />
              <Skeleton className="h-2 w-[100px] rounded-full" />
            </div>
          </div>
        ))}
      </div>
    </>
  );
};
