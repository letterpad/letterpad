import Image from "next/image";
import Link from "next/link";
import { FC } from "react";

import { getReadableDate } from "@/shared/utils";

import { Author, PostStats } from "../../../__generated__server/__types__";

interface Props {
  slug: string;
  title: string;
  link: string;
  excerpt?: string;
  sub_title?: string;
  cover_image: {
    src?: string;
    width?: number;
    height?: number;
  };
  author?: Omit<Author, "email" | "id">;
  stats?: PostStats;
  publishedAt?: string;
}
export const Card: FC<Props> = ({
  slug,
  title,
  link,
  excerpt,
  sub_title,
  cover_image,
  author,
  stats,
  publishedAt,
}) => {
  const origin =
    typeof window === "undefined"
      ? process.env.ROOT_URL
      : document.location.origin;
  const reading_time = stats?.reading_time?.replace("1 mins", "1 min");

  const avatar = author?.avatar
    ? author.avatar
    : "https://www.gravatar.com/avatar/";
  return (
    <div
      key={slug}
      className="w-full py-10 border-b border-slate-100 dark:border-slate-800"
    >
      <div className="flex items-center justify-between flex-row">
        <Link
          className="flex items-center justify-left flex-row gap-2"
          href={new URL(`@${author?.username}`, origin).toString()}
        >
          <div className="rounded-full flex-none">
            <img
              src={avatar}
              alt={author?.name}
              className="w-7 h-7 object-cover rounded-full"
            />
          </div>
          <span className="text-gray-800 dark:text-gray-200">
            {author?.name}
          </span>
        </Link>
      </div>
      <Link
        href={link}
        target="_blank"
        rel="noreferrer"
        className="flex flex-row justify-between"
      >
        <div className="flex flex-col gap-y-2  justify-between py-2">
          <div className="flex flex-col gap-1">
            <p className="text-lg font-bold block capitalize text-ellipsis text-gray-800 dark:text-gray-200">
              {title}
            </p>
            <span className="text-gray-800 mr-3 dark:text-gray-400">
              {excerpt ?? sub_title}
            </span>
          </div>
          <div className="flex gap-2 text-slate-600 dark:text-gray-400">
            {getReadableDate(new Date(publishedAt!))}
            <span>·</span>
            <span className="">{reading_time}</span>
          </div>
        </div>
        {cover_image.src && (
          <Image
            src={cover_image.src!}
            alt="Product"
            loading="lazy"
            height={cover_image.height}
            width={cover_image.width}
            className="h-36 w-36 object-cover rounded-xl"
          />
        )}
      </Link>
    </div>
  );
};
