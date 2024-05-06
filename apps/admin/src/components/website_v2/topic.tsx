"use client";
import classNames from "classnames";
import Link from "next/link";
import { FC } from "react";

import { EventAction, EventCategory, track } from "../../track";

interface Props {
  name: string;
  slug: string;
  selected?: string;
}
export const Topic: FC<Props> = ({ name, slug, selected }) => {
  const onClick = (category: string) => {
    track({
      eventAction: EventAction.Click,
      eventCategory: EventCategory.Topic,
      eventLabel: category,
    });
  };
  return (
    <li
      className={classNames({
        "bg-black/80 text-gray-100 hover:bg-black/80 hover:text-gray-100 dark:bg-slate-100 dark:text-gray-800":
          slug.split("/").pop() === decodeURIComponent(selected ?? ""),
      })}
      key={slug}
      data-selected={slug}
    >
      <Link
        href={`${slug!}`}
        onClick={() => onClick(name)}
        className="py-1 sm:py-1.5 font-sans border rounded-full dark:border-sky-500/20 dark:bg-sky-500/10 dark:text-gray-100 text-sm md:text-xs px-3 sm:px-4 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100 cursor-pointer"
      >
        {name}
      </Link>
    </li>
  );
};
