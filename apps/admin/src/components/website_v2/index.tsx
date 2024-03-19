import classNames from "classnames";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { IoRocketOutline } from "react-icons/io5";
import { TfiAnnouncement } from "react-icons/tfi";

import { AdminActions } from "./adminActions";
import { BannerAd } from "./banner/bannerAd";
import { SignupBanner } from "./banner/signupBanner";
import { Card } from "./card";
import {
  getfavAuthors,
  getLetterpadCategories,
  getLetterpadPosts,
} from "./data";
import { Featured } from "./featured";
import { InfiniteList } from "./infinite-list";
import Header from "../header/Header";
import { ProfileCard } from "../profile-card";
import Footer from "../website/Footer";
import { timeAgo } from "../../lib/timeAgo";
import { options } from "../../pages/api/auth/[...nextauth]";
import { fetchPostsByTag } from "../../resourceFetcher";
import { getRootUrl } from "../../shared/getRootUrl";
import { isMembershipFeatureActive } from "../../shared/utils";

export const Website = async () => {
  const [data, categories, favAuthors, posts] = await Promise.all([
    getLetterpadPosts({ filters: { cursor: "" } }),
    getLetterpadCategories(),
    getfavAuthors(),
    fetchPostsByTag(),
  ]);
  const isMemberFeatActive = isMembershipFeatureActive();
  const session = await getServerSession(options());
  const hasSession = !!session?.user?.id;
  const rows =
    data?.letterpadLatestPosts.__typename === "PostsNode"
      ? data.letterpadLatestPosts.rows
      : [];

  return (
    <>
      <div className="flex min-h-screen flex-col">
        <Header />
        {isMemberFeatActive ? (
          <BannerAd hasSession={hasSession} />
        ) : (
          <SignupBanner hasSession={hasSession} />
        )}

        <div className=" bg-slate-800 sticky top-0 border-t border-gray-800 z-10">
          <div className="overflow-x-auto max-w-6xl mx-auto py-4 p-2 relative">
            {/* <h2 className="font-bold mb-6 text-md">Topics:</h2> */}
            <div className="flex space-x-8 ">
              {categories?.popularTags?.rows?.map((category) => {
                return (
                  <div
                    className="text-sm whitespace-nowrap hover:text-white text-gray-100"
                    key={category.slug}
                  >
                    <Link href={`${category.slug!}`}>{category.name}</Link>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        <main className="grow">
          <div className="border-b dark:border-slate-800 mb-10">
            <div className="max-w-6xl mx-auto py-10 md:py-20 p-4 gap-4 flex flex-col">
              <Featured />
            </div>
          </div>
          <div className="flex flex-row max-w-6xl mx-auto px-4 sm:px-6 divide-x-[1px] dark:divide-slate-800 divide-slate-200">
            <section className="w-full mb-5 flex flex-col md:pr-10">
              {rows.map((item) => {
                const author =
                  item.author?.__typename === "Author" ? item.author : null;

                const link = new URL(
                  item.slug ?? "",
                  author?.site_url
                ).toString();

                return (
                  <div key={item.id}>
                    <AdminActions
                      id={item.id}
                      banned={!!item.banned}
                      isFavourite={!!author?.favourite}
                      authorId={author?.id!}
                    />
                    <Card
                      key={item.id}
                      {...item}
                      link={link}
                      slug={link}
                      author={author!}
                    />
                  </div>
                );
              })}
              <InfiniteList cursor={rows?.[rows.length - 1]?.id} />
            </section>
            <div
              className={classNames(
                "hidden md:min-w-80 py-10 top-0 space-y-8 md:pl-10",
                {
                  "md:block": posts.length > 0 || favAuthors?.length > 0,
                }
              )}
            >
              <section className="border-sky-100 dark:border-sky-500/20 rounded-lg bg-sky-50 dark:bg-blue-500/20 p-4 border">
                <h4 className="font-bold text-md pb-2 flex items-center gap-2 font-heading">
                  <TfiAnnouncement className="text-sky-500" />
                  Announcements
                </h4>
                <ul className="flex flex-col divide-y dark:divide-blue-500/30 divide-slate-100">
                  {posts.map((post) => {
                    return (
                      <li
                        className="text-gray-900 truncate dark:text-white  py-2 "
                        key={post.slug}
                      >
                        <Link
                          href={new URL(
                            post.slug,
                            "https://blog.letterpad.app"
                          ).toString()}
                          className="text-sm"
                          target="_blank"
                        >
                          <span className="font-[500]">{post.title}</span>

                          <p className="text-xs truncate opacity-80">
                            {post.sub_title}
                          </p>
                        </Link>
                        <div className="mt-1">
                          <time className="block text-[0.68rem] text-blue-500">
                            {timeAgo(post.publishedAt)}
                          </time>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </section>
              <section>
                <h4 className="font-bold text-md pb-2 font-heading flex items-center gap-2">
                  <IoRocketOutline className="text-sky-500" />
                  Our Favourite Authors
                </h4>
                <ul className="max-w-md">
                  {favAuthors?.map((author) => {
                    const authorLink = new URL(
                      `/@${author.username}`,
                      getRootUrl()
                    ).toString();

                    return (
                      <li className="py-1 sm:py-2" key={author.id}>
                        <ProfileCard
                          link={authorLink}
                          avatar={author?.avatar!}
                          name={author?.name!}
                          showProLabel={author?.is_paid_member!}
                          line2={author?.username!}
                          size="xs"
                        />
                      </li>
                    );
                  })}
                </ul>
              </section>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
};
