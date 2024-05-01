import classNames from "classnames";
import Link from "next/link";
import { FC } from "react";

interface Props {
  topics: any[];
  limit?: number;
  selected?: string;
}
export const Topics: FC<Props> = ({ topics, limit, selected }) => {
  const items = limit ? topics?.splice(0, limit) : topics;
  return (
    <>
      <ul className="flex flex-wrap gap-2">
        {items.map((category) => {
          return (
            <Link href={`${category.slug!}`}>
              <li
                className={classNames(
                  "py-1 sm:py-1.5 font-sans border rounded-full dark:border-sky-500/20 dark:bg-sky-500/10 dark:text-gray-100 text-sm md:text-xs px-3 sm:px-4 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100 cursor-pointer",
                  {
                    "bg-black/80 text-gray-100 hover:bg-black/80 hover:text-gray-100 dark:bg-slate-100 dark:text-gray-800":
                      category.slug.split("/").pop() ===
                      decodeURIComponent(selected ?? ""),
                  }
                )}
                key={category.slug}
                data-selected={category.slug}
              >
                {category.name}
              </li>
            </Link>
          );
        })}
      </ul>
      {limit && (
        <div className="py-6 px-2">
          <Link href="/topics" className="text-brand text-sm">
            Explore all topics
          </Link>
        </div>
      )}
    </>
  );
};
