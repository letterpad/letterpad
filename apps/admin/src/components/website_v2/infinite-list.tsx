"use client";
import { Post } from "letterpad-graphql";
import { FC, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";

import { AdminActions } from "./adminActions";
import { Card } from "./card";
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
      className="w-full mb-5 flex flex-col overflow-hidden"
    >
      {data.map((item) => {
        const author =
          item.author?.__typename === "Author" ? item.author : undefined;
        const link = new URL(item.slug ?? "", author?.site_url!).toString();
        return (
          <div key={item.id}>
              <AdminActions
                id={item.id}
                banned={item.banned!}
                isFavourite={author?.favourite!}
                authorId={author?.id!}
              />
            <Card {...item} link={link} slug={link} author={author} />
          </div>
        );
      })}
    </InfiniteScroll>
  );
};
