import { PostStatusOptions } from "letterpad-graphql";
import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { BiCalendar } from "react-icons/bi";
import { ProfileCard } from "ui/dist/isomorphic.mjs";

import { prisma } from "@/lib/prisma";

import { AboutStats } from "@/components/about-stats";

import { getTagsLinkedWithPosts } from "@/graphql/services/tag/getTags";
import { getRootUrl } from "@/shared/getRootUrl";
import { getReadableDate, TOPIC_PREFIX } from "@/shared/utils";

import { Feed } from "./feature/feed";
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
      membership: true,
    },
  });

  if (!author) return notFound();

  const siteUrl = getSiteUrl(author.setting?.site_url!, username);

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
    <div className="relative">
      <script
        key="structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="h-96">
        <img
          src={
            JSON.parse(setting?.banner ?? "{}")?.src ||
            "https://images.unsplash.com/photo-1579547621706-1a9c79d5c9f1?q=80&w=2970&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          }
          alt={setting?.site_title}
          className="w-full h-96 object-cover absolute object-bottom"
          loading="lazy"
        />
      </div>
      <div className="mx-auto max-w-6xl px-4 sm:px-6 md:-mt-64 -mt-72">
        <div className="z-10 relative bg-black/50 p-4 md:p-10 rounded-lg mb-28 text-white">
          <div className="flex flex-row items-start justify-center md:justify-between">
            <ProfileCard
              link={"/"}
              avatar={author?.avatar!}
              name={author?.name!}
              showProLabel={author.membership?.status === "active"}
              line2={
                <div className="-mt-2 text-gray-200">
                  <span className="text-sm">@{author?.username!}</span>
                  <span className="block text-xs">{occupation}</span>
                </div>
              }
              size="xl"
              className="mb-6"
            />
            <div className="hidden md:block">
              <FollowMe username={username} />
            </div>
          </div>
          <div className="flex items-center md:justify-between flex-col md:flex-row ">
            <AboutStats username={username} id={author.id} siteUrl={siteUrl} />
            <div className="flex flex-col gap-6 p-3 mt-30">
              <span className="flex gap-2 items-center text-slate-300 text-sm">
                <BiCalendar />
                Member Since:
                <span className="text-slate-200 ">
                  {getReadableDate(Number(createdAt))}
                </span>
              </span>
            </div>
            <div className="md:hidden  py-4">
              <FollowMe username={username} />
            </div>
          </div>
        </div>

        <div className="flex gap-8 items-start pb-32 flex-col  md:flex-row">
          <div className="md:max-w-2xl w-full">
            <h2 className="text-2xl font-bold">About Me</h2>
            <p
              className="block antialiased font-paragraph text-md font-normal leading-relaxed text-inherit mt-8 md:max-w-2xl max-w-sm"
              dangerouslySetInnerHTML={{ __html: bio ?? "Empty" }}
            ></p>
            <hr className="h-px my-8 bg-gray-200 border-0 dark:bg-gray-700" />
            <div className="mt-10">
              <Suspense fallback={<div>Loading...</div>}>
                <Feed authorId={author.id} site_url={siteUrl} />
              </Suspense>
            </div>
          </div>

          <div className="py-20 md:py-0 flex flex-col">
            <div>
              <h3 className="block antialiased tracking-normal font-semibold text-inherit text-[1.1rem] py-2">
                Socials:
              </h3>
              <div className="flex items-center justify-start">
                <SocialIcons social={JSON.parse(author.social)} />
              </div>
            </div>
            <hr className="h-px my-8 bg-gray-200 border-0 dark:bg-gray-700" />
            <div>
              <h3 className="block antialiased tracking-normal font-semibold text-inherit text-[1.1rem] py-2">
                Publishes At:
              </h3>
              <div className="flex gap-2 flex-row justify-between items-center">
                <Link
                  href={siteUrl}
                  target="_blank"
                  rel="noreferrer"
                  prefetch={false}
                >
                  <div>
                    <span className="font-bold text-md">
                      {setting?.site_title}
                    </span>
                    <p className="font-paragraph text-blue-500 underline">
                      {siteUrl}
                    </p>
                  </div>
                </Link>
              </div>
            </div>
            <hr className="h-px my-8 bg-gray-200 border-0 dark:bg-gray-700" />
            <div className="max-w-xs">
              <h3 className="block antialiased tracking-normal font-sans font-semibold text-inherit text-[1.1rem] py-2">
                Topics I write about:
              </h3>
              <div className="flex flex-wrap leading-11 font-paragraph">
                {data?.map((tag) => {
                  return (
                    <Link
                      prefetch={false}
                      key={tag.id}
                      target="_blank"
                      href={new URL(`/tag/${tag.name}`, siteUrl).href}
                    >
                      <span className="py-1.5 px-4 me-2 mb-1 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-full border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-800 dark:hover:text-white dark:hover:bg-gray-700">
                        {tag.name.replace(TOPIC_PREFIX, "")}
                      </span>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;

const getSiteUrl = (site_url: string, username: string) => {
  try {
    new URL(site_url);
    return site_url;
  } catch (e) {
    //
  }
  return "https://" + username + "." + new URL(getRootUrl()).hostname;
};
