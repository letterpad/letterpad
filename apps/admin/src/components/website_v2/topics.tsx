import classNames from "classnames";
import Link from "next/link";
import { FC } from "react";
import { Skeleton } from "ui/isomorphic";

import { getLetterpadCategories } from "./data";
import { Topic } from "./topic";

interface Props {
  limit?: number;
  selected?: string;
}
export const Topics: FC<Props> = async ({ limit, selected }) => {
  const categories = await getLetterpadCategories();
  const topics = categories?.popularTags?.rows!;
  const items = limit ? topics?.splice(0, limit) : topics;

  return (
    <>
      <ul className="flex flex-wrap gap-4">
        {items?.map((category) => (
          <Topic {...category} selected={selected} key={category.name} />
        ))}
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
export const TopicsPlaceholder = () => {
  const items = Array.from({ length: 8 });
  return (
    <>
      <ul className="flex flex-wrap gap-4">
        {items.map((_, i) => (
          <Skeleton
            key={i}
            className={classNames(
              "py-1 sm:py-1.5 font-sans border rounded-full px-3 sm:px-4 h-8 cursor-pointer w-24",
              {
                "w-28": i % 2 === 0,
                "w-36": i % 3 === 0,
              }
            )}
          />
        ))}
      </ul>
    </>
  );
};
