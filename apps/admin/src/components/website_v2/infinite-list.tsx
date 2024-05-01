"use client";
import { Post } from "letterpad-graphql";
import { FC, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";

import { RenderCard } from "./card";
import { getLetterpadPosts } from "./data";

interface Props {
  cursor: string;
  tag?: string;
}

export const InfiniteList: FC<Props> = ({ tag, cursor }) => {
  const [data, setData] = useState<Post[]>([]);

  const loadMore = () => {
    getLetterpadPosts({
      filters: { cursor: data[data.length - 1]?.id ?? cursor, tag },
    }).then((res) => {
      if (res?.letterpadLatestPosts.__typename === "PostsNode") {
        const newRows = res.letterpadLatestPosts.rows;
        setData((data) => [...data, ...(newRows as any)]);
      }
    });
  };

  return (
    <InfiniteScroll
      dataLength={data.length}
      next={loadMore}
      hasMore={true}
      loader={null}
      style={{ overflow: "hidden" }}
      className="w-full mb-5 flex flex-col overflow-hidden gap-8"
    >
      {data.map((post) => (
        <RenderCard key={post.slug} post={post} />
      ))}
    </InfiniteScroll>
  );
};
