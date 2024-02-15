import Link from "next/link";

import { Banner } from "./banner";
import { Card } from "./card";
import {
  getLetterpadCategories,
  getLetterpadPosts,
  getNewAuthors,
} from "./data";
import { Featured } from "./featured";
import { InfiniteList } from "./infinite-list";
import Header from "../header/Header";

export const Website = async () => {
  const data = await getLetterpadPosts({ filters: { cursor: 0 } });
  const categories = await getLetterpadCategories();
  const newAuthors = await getNewAuthors();
  const rows =
    data?.letterpadLatestPosts.__typename === "PostsNode"
      ? data.letterpadLatestPosts.rows
      : [];
  return (
    <>
      <div className="flex min-h-screen flex-col overflow-hidden dark:bg-gray-900 dark:text-gray-100 text-black/60">
        <Header />
        <Banner />

        <main className="grow">
          <div className="border-b dark:border-slate-800 mb-10">
            <div className="max-w-6xl mx-auto py-10 md:py-20 p-4 gap-4 flex flex-col">
              <Featured />
            </div>
          </div>
          <div className="flex flex-row max-w-6xl mx-auto px-4 sm:px-6 md:gap-8">
            <section className="w-full mb-5 flex flex-col overflow-hidden">
              {rows.map((item) => {
                const author =
                  item.author?.__typename === "Author" ? item.author : null;

                const link = new URL(
                  item.slug ?? "",
                  `https://${author?.username}.letterpad.app`
                ).toString();
                return (
                  <Card
                    key={item.id}
                    {...item}
                    link={link}
                    slug={link}
                    author={author!}
                  />
                );
              })}
              <InfiniteList cursor={rows?.[rows.length - 1]?.id} />
            </section>
            <div className="hidden md:block md:ml-10 md:min-w-52 py-10">
              <section className="mb-10">
                <h4 className="font-bold text-lg pb-2">New Authors</h4>
                <ul className="flex flex-col gap-4 py-2">
                  {newAuthors?.map((author) => {
                    return (
                      <li className="text-md" key={author.id}>
                        <div className="flex items-center justify-between flex-row">
                          <Link
                            className="flex items-center justify-left flex-row gap-2"
                            href={`/@${author?.username}`}
                          >
                            <div className="rounded-full flex-none">
                              <img
                                src={author?.avatar}
                                alt={author?.name}
                                className="w-6 h-6 object-cover rounded-full"
                              />
                            </div>
                            <span className="text-gray-800 dark:text-gray-200 truncate">
                              {author?.name}
                            </span>
                          </Link>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </section>
              <section className="">
                <h4 className="font-bold text-lg pb-2">Topics</h4>
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
