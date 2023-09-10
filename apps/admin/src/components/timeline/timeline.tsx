import Link from "next/link";
import { FC, useState } from "react";
import { HiPencil } from "react-icons/hi";

import { formatDate } from "./utils";
import { useGetPost } from "../../app/post/[postId]/_feature/api.client";
import { History, PostVersion } from "../../lib/versioning";

interface Props {
  onTimelineChange: (data: { timestamp: string; change: string }) => void;
}

export const Timeline: FC<Props> = ({ onTimelineChange }) => {
  const res = useGetPost({ id: 3 });
  const data: History[] = parseDrafts(res.data?.html_draft);
  const activeIndex = data.findIndex((item) => item.active);
  const [active, setActive] = useState(activeIndex);
  const pv = new PostVersion(data);
  return (
    <>
      <div className="h-[calc(100vh-245px)] overflow-y-scroll">
        <ol className="relative ml-10 flex w-52 list-none flex-col-reverse border-l border-gray-200 p-0 pt-8 dark:border-gray-700">
          {data.map((item, idx) => (
            <li
              className="mb-10 ml-6 flex items-center p-0"
              key={item.timestamp}
            >
              <span className="absolute -left-3 flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 ring-8 ring-white dark:bg-blue-900 dark:ring-gray-900">
                <HiPencil size={14} />
              </span>
              <div className="flex flex-col">
                <time className="block text-xs font-normal leading-none text-gray-500 dark:text-gray-400">
                  {formatDate(new Date(item.timestamp))}{" "}
                  <span className="text-xs font-extrabold text-red-500">
                    {item.live ? "- Live" : ""}
                  </span>
                </time>
                {active === idx ? (
                  <span className="text-xs font-extrabold text-green-600">
                    Draft
                  </span>
                ) : (
                  <Link
                    href="#"
                    className="text-xs text-blue-600 dark:text-blue-600"
                    onClick={(e) => {
                      e.preventDefault();
                      setActive(idx);
                      onTimelineChange({
                        timestamp: item.timestamp,
                        change: pv.retrieveBlogAtIndex(idx) ?? "",
                      });
                    }}
                  >
                    Open
                  </Link>
                )}
              </div>
            </li>
          ))}
        </ol>
      </div>
      <div className="prose h-[calc(100vh-240px)] w-full max-w-3xl overflow-y-scroll border p-8 dark:prose-dark dark:border-slate-700 dark:bg-black/50">
        <div
          dangerouslySetInnerHTML={{
            __html: pv.retrieveBlogAtIndex(active) ?? "",
          }}
        ></div>
      </div>
    </>
  );
};

function parseDrafts(drafts) {
  try {
    return JSON.parse(drafts);
  } catch (e) {
    return [
      { content: drafts, timestamp: new Date().toISOString(), patches: [] },
    ];
  }
}
