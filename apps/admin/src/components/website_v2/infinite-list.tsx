"use client";
import { AiOutlineLoading3Quarters } from "@react-icons/all-files/ai/AiOutlineLoading3Quarters";
import { FC, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";

import {
  EditorialTopicStory,
  TopicStoryRow,
} from "@/components/homepage/story";

import { RenderCard } from "./card";
import { getLetterpadPosts } from "./data";

interface Props {
  cursor: string;
  tag?: string;
  editorial?: { initialCount: number; canModerate: boolean };
}

export const InfiniteList: FC<Props> = ({ tag, cursor, editorial }) => {
  const [data, setData] = useState<TopicStoryRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  async function loadMore() {
    if (loading || !hasMore) return;
    setLoading(true);
    try {
      const response = await getLetterpadPosts({
        filters: { cursor: data[data.length - 1]?.id ?? cursor, tag },
      });
      const result = response?.letterpadLatestPosts;
      if (result?.__typename !== "PostsNode") {
        setHasMore(false);
        return;
      }
      const rows = result.rows;
      setData((current) => [...current, ...rows]);
      const count = (editorial?.initialCount ?? 0) + data.length + rows.length;
      setHasMore(rows.length > 0 && count < result.count);
    } catch {
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  }

  return (
    <InfiniteScroll
      dataLength={data.length}
      next={loadMore}
      hasMore={hasMore}
      loader={null}
      style={{ overflow: "hidden" }}
      className={
        editorial
          ? undefined
          : "w-full mb-5 flex flex-col overflow-hidden gap-8"
      }
    >
      {data.map((post) =>
        editorial ? (
          <EditorialTopicStory
            key={post.id}
            post={post}
            canModerate={editorial.canModerate}
          />
        ) : (
          <RenderCard key={post.id} post={post} />
        )
      )}
      {loading && (
        <div className="flex items-center justify-center">
          <AiOutlineLoading3Quarters className="animate-spin" size={24} />
        </div>
      )}
    </InfiniteScroll>
  );
};
