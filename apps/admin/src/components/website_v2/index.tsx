import Link from "next/link";

import { Card } from "./card";
import { getLetterpadCategories, getLetterpadPosts } from "./data";
import { InfiniteList } from "./infinite-list";
import Header from "../header/Header";

export const Website = async () => {
  const data = await getLetterpadPosts(0);
  const categories = await getLetterpadCategories();
  const rows =
    data.letterpadLatestPosts.__typename === "PostsNode"
      ? data.letterpadLatestPosts.rows
      : [];
  return (
    <>
      <div className="flex min-h-screen flex-col overflow-hidden dark:bg-gray-900 dark:text-gray-100 text-black/60">
        <Header />
        <main className="grow">
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
              <section>
                <h3 className="font-bold text-lg pb-2">Recommended Topics</h3>
                <ul className="flex flex-col gap-2">
                  {categories?.popularTags?.rows?.map((category) => {
                    return (
                      <li className="text-md">
                        <Link href={`${category.slug!}`}>
                          {category.name} ({category.count})
                        </Link>
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
