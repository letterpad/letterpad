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
      <div className="flex min-h-screen flex-col overflow-hidden bg-gray-900 text-gray-100">
        <Header />
        <main className="grow">
          <div className="flex flex-row max-w-6xl mx-auto">
            <section className="w-full mb-5 flex flex-col max-w-2xl mx-auto overflow-hidden">
              {rows.map((item) => {
                const author =
                  item.author?.__typename === "Author" ? item.author : null;

                const link = `https://${author?.username}.letterpad.app/${item.slug}`;
                return (
                  <Card {...item} link={link} slug={link} author={author!} />
                );
              })}
              <InfiniteList cursor={rows?.[rows.length - 1]?.id} />
            </section>
            <div className="w-72 py-10">
              <section>
                <h3 className="font-bold text-lg pb-2">Recommended Topics</h3>
                <ul className="flex flex-col gap-2">
                  {categories.categories.rows?.map((category) => {
                    return (
                      <li className="text-md">
                        <Link href={`/category/${category.slug!}`}>
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
