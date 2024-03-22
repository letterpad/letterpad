import { Author, PostStats } from "letterpad-graphql";
import Image from "next/image";
import Link from "next/link";
import { FC } from "react";
import { SlBadge } from "react-icons/sl";
import { ProfileCard } from "ui/isomorphic";

import { getReadableDate } from "@/shared/utils";

import { getRootUrl } from "../../shared/getRootUrl";

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
  author?: Omit<Author, "email">;
  stats?: PostStats;
  publishedAt?: string;
  featured?: boolean;
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
  featured,
}) => {
  const origin =
    typeof window === "undefined" ? getRootUrl() : document.location.origin;
  const reading_time = stats?.reading_time?.replace("1 mins", "1 min");

  const avatar = author?.avatar
    ? author.avatar
    : "https://www.gravatar.com/avatar/";

  const authorLink = new URL(`@${author?.username}`, origin).toString();
  return (
    <div
      key={slug}
      className="w-full py-10 border-b border-slate-100 dark:border-slate-800"
    >
      <div className="flex items-center justify-between flex-row">
        <ProfileCard
          link={authorLink}
          avatar={avatar}
          name={author?.name!}
          showProLabel={author?.is_paid_member!}
          size="sm"
        />
      </div>
      <Link
        href={link}
        target="_blank"
        rel="noreferrer"
        className="flex flex-row justify-between md:gap-6"
      >
        <div className="flex flex-col gap-y-2 justify-between py-2">
          <div className="flex flex-col gap-1">
            <p className="font-heading text-lg font-[600] block text-ellipsis text-gray-800 dark:text-gray-200">
              {title}
            </p>
            <span className="text-gray-800 mr-3 dark:text-gray-400 line-clamp-2">
              {excerpt ?? sub_title}
            </span>
          </div>
          <div className="flex gap-2 text-slate-600 dark:text-gray-400 font-heading">
            {getReadableDate(new Date(publishedAt!))}
            <span>·</span>
            <span className="">{reading_time}</span>
            {featured && (
              <>
                <span>·</span>
                <span className="bg-blue-100 text-blue-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded-full dark:bg-blue-900 dark:text-blue-300 flex items-center gap-1">
                  <SlBadge />
                  Featured
                </span>
              </>
            )}
          </div>
        </div>
        {cover_image.src && (
          <Image
            src={
              cover_image.src?.replace(
                "image/upload",
                "image/upload/c_scale,w_200"
              )!
            }
            alt="Product"
            loading="lazy"
            height={cover_image.height}
            width={cover_image.width}
            className="h-36 w-36 object-cover rounded-xl hidden md:block"
          />
        )}
      </Link>
    </div>
  );
};
