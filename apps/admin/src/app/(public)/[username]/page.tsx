import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BiCalendar, BiPencil } from "react-icons/bi";
import { TfiNewWindow } from "react-icons/tfi";

import { prisma } from "@/lib/prisma";

import { AboutStats } from "@/components/about-stats";
import { PageView } from "@/components/pageView";

import { PostStatusOptions, PostTypes } from "@/__generated__/__types__";
import { getTagsLinkedWithPosts } from "@/graphql/services/tag/getTags";
import { getRootUrl } from "@/shared/getRootUrl";
import { getReadableDate } from "@/shared/utils";

import { FollowMe } from "./followme";
import { SocialIcons } from "./social";

export async function generateMetadata({ params }): Promise<Metadata> {
  const username = decodeURIComponent(params.username).replace("@", "");
  const data = await prisma.author.findFirst({
    where: { username },
    include: {
      setting: true,
    },
  });
  if (!data) return {};
  const { setting, ...me } = data;
  const banner = JSON.parse(setting?.banner ?? "{}");
  return {
    title: `${me.name}'s profile on Letterpad`,
    description: me.signature ?? me.bio,
    category: "Profile",
    twitter: {
      title: `${me.name}'s profile on Letterpad`,
      images: [
        {
          url: banner?.src!,
          width: banner?.width!,
          height: banner?.height!,
          alt: setting?.site_title,
        },
      ],
      card: "summary_large_image",
      description: me.signature! ?? me.bio,
    },
    alternates: {
      canonical: `${getRootUrl()}/@${me.username}`,
    },
    openGraph: {
      url: `${getRootUrl()}/@${me.username}`,
      title: `${me.name}'s profile on Letterpad`,
      description: me.signature! ?? me.bio,
      authors: [me.name],
      firstName: me.name,
      siteName: setting?.site_title,
      images: [
        {
          url: banner?.src!,
          width: banner?.width!,
          height: banner?.height!,
          alt: setting?.site_title,
        },
      ],
    },
  };
}

const About = async ({ params }: { params: { username: string } }) => {
  const username = decodeURIComponent(params.username).replace("@", "");
  const author = await prisma.author.findFirst({
    where: { username },
    include: {
      setting: true,
    },
  });

  if (!author) return notFound();
  const feed = await prisma.post.findMany({
    where: {
      author: {
        id: author.id,
      },
      status: PostStatusOptions.Published,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  const data = await getTagsLinkedWithPosts({
    id: author.id,
    status: PostStatusOptions.Published,
  });

  const {
    name,
    avatar = "/static/images/avatar.png",
    bio,
    signature,
    occupation,
    createdAt,
    setting,
  } = author;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    dateCreated: createdAt,
    headline: `${name}'s profile on Letterpad`,
    description: signature ?? bio,
    image: avatar,
    author: [
      {
        "@type": "Person",
        name: name,
      },
    ],
    mainEntity: {
      "@type": "Person",
      name: name,
      description: signature ?? bio,
      image: avatar,
    },
  };

  return (
    <>
      <script
        key="structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mt-16 flex flex-row items-start justify-between">
          <div className="flex gap-2 md:gap-4 items-center flex-row">
            <span className="rounded p-1 bg-black dark:bg-white">
              <img
                src={avatar}
                alt="avatar"
                className="w-16 h-16 md:w-20 md:h-20 rounded-full object-cover"
              />
            </span>
            <div className="flex justify-between flex-col">
              <h1
                itemProp="name"
                className="block antialiased tracking-normal font-sans font-semibold text-inherit text-2xl md:text-3xl"
              >
                {name}
              </h1>
              <span className="font-bold">@{username}</span>
              <span>{occupation}</span>
            </div>
          </div>
          <FollowMe username={username} />
        </div>
        <div className="space-y-4">
          <AboutStats username={username} />
          <div className="flex flex-col gap-6 p-3 border rounded mt-2 border-slate-200 dark:border-slate-800 dark:bg-sky-900/10">
            <span className="flex gap-2 items-center dark:text-slate-400">
              <BiCalendar />
              Member Since
              <span className="dark:text-white">
                {getReadableDate(Number(createdAt))}
              </span>
            </span>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex items-center justify-between">
              <SocialIcons social={JSON.parse(author.social)} />
            </div>
          </div>
        </div>
        <div className="flex gap-8 items-start pb-32 flex-col md:flex-row">
          <div>
            <div className="p-4 rounded dark:border-slate-800 dark:bg-sky-900/10 border">
              <h3 className="block antialiased tracking-normal font-semibold text-inherit text-[1.1rem] py-2">
                Publishes At:
              </h3>
              <div className="flex gap-2 flex-row justify-between items-center">
                <Link
                  href={setting?.site_url!}
                  target="_blank"
                  rel="noreferrer"
                >
                  <div>
                    <span className="font-bold text-lg">
                      {setting?.site_title}
                    </span>
                    <p>{setting?.site_url}</p>
                  </div>
                </Link>
                <a
                  href={setting?.site_url!}
                  target="_blank"
                  type="button"
                  className="text-slate-800 bg-slate-200 hover:bg-slate-300 font-bold rounded-full text-sm px-5 py-2 text-center flex gap-1 items-center"
                  rel="noreferrer"
                >
                  <TfiNewWindow size={18} /> <span>Visit</span>
                </a>
              </div>
            </div>
            <p
              className="block antialiased font-sans text-md font-normal leading-relaxed text-inherit mt-8 max-w-2xl"
              dangerouslySetInnerHTML={{ __html: bio }}
            ></p>
            <div className="max-w-2xl">
              <h3 className="block antialiased tracking-normal font-sans font-semibold text-inherit text-xl py-5 mt-10">
                Topics I write about:
              </h3>
              <div className="flex flex-wrap leading-11">
                {data?.map((tag) => {
                  return (
                    <Link
                      key={tag.id}
                      target="_blank"
                      href={new URL(`/tag/${tag.name}`, setting?.site_url).href}
                    >
                      <span className="py-1.5 px-4 me-2 mb-1 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-full border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700">
                        {tag.name}
                      </span>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>

          {feed.length && (
            <div className="py-20 md:py-0">
              <h3 className="block antialiased tracking-normal font-sans font-semibold text-inherit text-xl py-4">
                Feed
              </h3>
              <ol className="relative border-s border-gray-200 dark:border-gray-700">
                {feed.map((row) => {
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
                      <h3 className="text-md font-semibold text-gray-900 dark:text-white">
                        <Link
                          href={
                            new URL(`post/${row.slug}`, setting?.site_url).href
                          }
                          target="_blank"
                        >
                          {row.title}
                        </Link>
                      </h3>
                    </li>
                  );
                })}
              </ol>
            </div>
          )}
        </div>
        <PageView type="profile" id={author.id} />
      </div>
    </>
  );
};

export default About;
