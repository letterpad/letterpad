"use client";
import { Post } from "letterpad-graphql";
import { FC, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";

import { AdminActions } from "./adminActions";
import { Card } from "./card";
import { getLetterpadPosts } from "./data";
import { TOPIC_PREFIX } from "../../shared/utils";
import { isTagsNode } from "../../utils/type-guards";

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
      {data.map((item) => {
        const author =
          item.author?.__typename === "Author" ? item.author : undefined;
        const link = new URL(item.slug ?? "", author?.site_url!).toString();
        const tag = isTagsNode(item.tags)
          ? item.tags.rows.find((tag) => tag.name.startsWith(TOPIC_PREFIX))
          : null;

        const tagName = tag?.name.replace(TOPIC_PREFIX, "");
        return (
          <div key={item.id}>
            <AdminActions
              id={item.id}
              banned={item.banned!}
              isFavourite={author?.favourite!}
              authorId={author?.id!}
            />
            <Card
              {...item}
              link={link}
              slug={link}
              author={author}
              category={tagName}
              categorySlug={tag?.slug}
            />
          </div>
        );
      })}
    </InfiniteScroll>
  );
};
