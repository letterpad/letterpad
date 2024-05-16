import { IoIosRibbon } from "@react-icons/all-files/io/IoIosRibbon";
import {
  Author,
  LetterpadLatestPostsQuery,
  PostStats,
} from "letterpad-graphql";
import Image from "next/image";
import Link from "next/link";
import { FC } from "react";
import { ProfileCard } from "ui/dist/isomorphic.mjs";

import { getRootUrl } from "@/shared/getRootUrl";
import { getReadableDate, TOPIC_PREFIX } from "@/shared/utils";

import { AdminActions } from "./adminActions";

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
  category?: string;
  categorySlug?: string;
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
  category,
  categorySlug,
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
      data-aos="fade-down"
      data-aos-easing="linear"
      data-aos-duration="200"
      key={slug}
      className="relative w-full px-2 py-4 md:p-6 rounded border dark:border-brand/10 border-slate-200 bg-brand/5 dark:bg-brand/5"
    >
      {featured && (
        <span className="bg-blue-100 text-blue-800 font-medium me-2 px-2.5 py-0.5 dark:bg-blue-900 dark:text-blue-300 flex items-center gap-1 absolute top-0 -right-2 text-xs rounded-bl-md">
          <IoIosRibbon />
          Featured
        </span>
      )}
      <div className="flex items-center justify-between flex-row">
        <ProfileCard
          link={authorLink}
          avatar={avatar}
          name={<span className="font-semibold">{author?.name!}</span>}
          showProLabel={author?.is_paid_member!}
          size="xs"
        />
      </div>
      <div className="flex flex-row justify-between md:gap-6">
        <div className="flex flex-1 flex-col gap-y-4 justify-between py-2 text-gray-800 dark:text-gray-200">
          <Link className="flex flex-col gap-2" href={link}>
            <p className="font-sans md:text-md font-extrabold block text-ellipsis">
              {title}
            </p>
            <span className="opacity-70 mr-3 dark:text-gray-300/80 line-clamp-2 font-medium font-heading">
              {excerpt ?? sub_title}
            </span>
          </Link>
          <div className="flex gap-2 font-light opacity-80 text-sm">
            {getReadableDate(new Date(publishedAt!))}
            <span>·</span>
            <span className="">{reading_time}</span>
            {category && (
              <>
                <span>·</span>
                <Link href={categorySlug!} className="font-semibold">
                  {transformText(category)}
                </Link>
              </>
            )}
          </div>
        </div>
        {cover_image.src && (
          <Link className="hidden md:block" href={link}>
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
              className="h-36 w-36 object-cover rounded-xl"
            />
          </Link>
        )}
      </div>
    </div>
  );
};

type PostRow = Extract<
  LetterpadLatestPostsQuery["letterpadLatestPosts"],
  { __typename: "PostsNode" }
>["rows"][number];

export const RenderCard: FC<{ post: PostRow }> = ({ post }) => {
  const author = isAuthor(post.author) ? post.author : null;
  const link = new URL(post.slug ?? "", author?.site_url).toString();
  const tag = isTagsNode(post.tags)
    ? post.tags.rows.find((tag) => tag.name.startsWith(TOPIC_PREFIX))
    : null;
  const tagName = tag?.name.replace(TOPIC_PREFIX, "");

  return (
    <div key={post.id}>
      <AdminActions
        id={post.id}
        banned={!!post.banned}
        isFavourite={!!author?.favourite}
        authorId={author?.id!}
      />
      <Card
        key={post.id}
        {...post}
        link={link}
        slug={link}
        author={author!}
        category={tagName}
        categorySlug={tag?.slug}
      />
    </div>
  );
};

function transformText(text) {
  return text
    .replaceAll("-", " ")
    .replaceAll("&", "and")
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

const isTagsNode = (
  obj: any
): obj is PostRow["tags"] & {
  __typename: "TagsNode";
} => {
  return obj && obj.__typename === "TagsNode";
};

const isAuthor = (
  obj: any
): obj is PostRow["author"] & {
  __typename: "Author";
} => {
  return obj && obj.__typename === "Author";
};
