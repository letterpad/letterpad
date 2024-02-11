"use client";
import { FC, useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";

import { Card } from "./card";
import { getLetterpadPosts } from "./data";
import { Post } from "../../../__generated__server/__types__";

interface Props {
  cursor: number;
  tag?: string;
}

export const InfiniteList: FC<Props> = ({ cursor, tag }) => {
  const [data, setData] = useState<Post[]>([]);

  const loadMore = () => {
    getLetterpadPosts({
      filters: { cursor: data[data.length - 1]?.id, tag },
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
      className="w-full mb-5 flex flex-col overflow-hidden"
    >
      {data.map((item) => {
        const username =
          item.author?.__typename === "Author" ? item.author.username : "";
        const link = `https://${username}.letterpad.app/${item.slug}`;
        return (
          <Card
            {...item}
            link={link}
            slug={link}
            author={
              item.author?.__typename === "Author" ? item.author : undefined
            }
          />
        );
      })}
    </InfiniteScroll>
  );
};
