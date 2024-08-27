import { PostStatusOptions, PostTypes } from "letterpad-graphql";
import Link from "next/link";
import { BiPencil } from "react-icons/bi";

import { prisma } from "@/lib/prisma";

import { getReadableDate } from "@/shared/utils";

export const Feed = async ({ authorId, site_url }) => {
  const feed = await prisma.post.findMany({
    where: {
      author: {
        id: authorId,
      },
      status: PostStatusOptions.Published,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <section>
      <h3 className="block antialiased tracking-normal font-sans font-semibold text-inherit text-xl py-4">
        Feed
      </h3>
      <ol className="relative border-s border-gray-200 dark:border-gray-700">
        {feed.length === 0 && "No posts yet :("}
        {feed?.map((row) => {
          return (
            <li className="mb-10 ms-4">
              <div className="absolute w-3 h-3 bg-gray-200 rounded-full mt-1.5 -start-1.5 border border-white dark:border-gray-900 dark:bg-gray-700"></div>
              <time className="mb-1 text-sm font-normal leading-none text-gray-500 dark:text-gray-500 flex gap-4">
                {getReadableDate(new Date(row.publishedAt!))}{" "}
                <span className="flex gap-1">
                  <BiPencil />
                  {row.type === PostTypes.Post ? "Article" : "Page"}
                </span>
              </time>
              <p className="text-base font-normal text-gray-500 dark:text-gray-400"></p>
              <h3 className="text-[0.9rem] font-semibold text-gray-900 dark:text-white">
                <Link
                  prefetch={false}
                  href={new URL(`post/${row.slug}`, site_url).href}
                  target="_blank"
                >
                  {row.title}
                </Link>
              </h3>
            </li>
          );
        })}
      </ol>
    </section>
  );
};
