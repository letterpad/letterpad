import Link from "next/link";
import { IoStar } from "react-icons/io5";

import { getFeaturedPosts } from "./data";
import { getRootUrl } from "../../shared/getRootUrl";
import { getReadableDate } from "../../shared/utils";
import { Author } from "../../../__generated__server/__types__";

export const Featured = async () => {
  const posts = await getFeaturedPosts();
  return (
    <>
      <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <IoStar className="dark:text-yellow-500 text-yellow-500" />
        Featured
      </h2>

      <div className="flex flex-row justify-between md:gap-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-2 md:gap-10 w-full">
          {posts.map((article) => {
            const author = isAuthor(article.author) ? article.author : null;
            const link = new URL(
              article.slug ?? "",
              `https://${author?.username}.letterpad.app`
            ).toString();
            return (
              <div key={article.id} className="flex mb-4 flex-col gap-2">
                <div className="flex items-center">
                  <img
                    src={article.cover_image.src}
                    alt={article.title}
                    className="w-20 h-24 rounded-lg mr-4 object-cover"
                  />
                  <div className="flex flex-col justify-between h-full py-1">
                    <div>
                      <Link
                        className="flex items-center gap-2 mb-2"
                        href={new URL(
                          `@${author?.username}`,
                          getRootUrl()
                        ).toString()}
                      >
                        <img
                          src={
                            author?.avatar ?? "https://www.gravatar.com/avatar/"
                          }
                          alt={article.title}
                          className="w-4 h-4 rounded-full"
                        />
                        <span className="text-sm">{author?.name ?? ""}</span>
                      </Link>
                      <Link
                        className="flex items-center gap-2 mb-2"
                        href={link}
                      >
                        <span className="text-base font-semibold text-wrap break-words line-clamp-2">
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
