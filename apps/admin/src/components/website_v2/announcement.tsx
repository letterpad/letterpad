import Link from "next/link";
import { FC } from "react";
import { TfiAnnouncement } from "react-icons/tfi";

import { timeAgo } from "../../lib/timeAgo";
import { fetchPostsByTag } from "../../resourceFetcher";
import { EventAction, EventCategory, EventLabel, track } from "../../track";

export const Announcements: FC = async () => {
  const posts = await fetchPostsByTag();

  const onAnouncementClick = () => {
    track({
      eventAction: EventAction.Click,
      eventCategory: EventCategory.Announcement,
      eventLabel: EventLabel.ViewItem,
    });
  };
  return (
    <>
      <h4 className="font-bold text-md pb-2 flex items-center gap-2 font-heading">
        <TfiAnnouncement className="text-brand" />
        Announcements
      </h4>
      <ul className="flex flex-col divide-y dark:divide-blue-500/30 divide-brand/10">
        {posts?.map((post) => {
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
                // onClick={onAnouncementClick}
              >
                <span className="font-[500]">{post.title}</span>

                <p className="text-xs truncate opacity-80">{post.sub_title}</p>
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
    </>
  );
};
