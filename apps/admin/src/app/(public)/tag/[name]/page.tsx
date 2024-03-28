import { Card } from "@/components/website_v2/card";
import { getLetterpadPosts } from "@/components/website_v2/data";
import { InfiniteList } from "@/components/website_v2/infinite-list";

import { TOPIC_PREFIX } from "../../../../shared/utils";
import { isTagsNode } from "../../../../utils/type-guards";

const Tag = async ({ params }: { params: { name: string } }) => {
  const data = await getLetterpadPosts({
    filters: { tag: decodeURIComponent(params.name), cursor: "" },
  });
  const rows =
    data?.letterpadLatestPosts.__typename === "PostsNode"
      ? data.letterpadLatestPosts.rows
      : [];
  return (
    <>
      <section className="w-full mb-5 flex flex-col overflow-hidden gap-8 my-12">
        {rows.map((item) => {
          const author =
            item.author?.__typename === "Author" ? item.author : null;
          const tag = isTagsNode(item.tags)
            ? item.tags.rows.find((tag) => tag.name.startsWith(TOPIC_PREFIX))
            : null;
          const tagName = tag?.name.replace(TOPIC_PREFIX, "");
          try {
            const link = new URL(item.slug ?? "", author?.site_url).toString();
            return (
              <Card
                key={item.id}
                {...item}
                link={link}
                slug={link}
                author={author!}
                category={tagName}
                categorySlug={tag?.slug}
              />
            );
          } catch (e) {}
          return null;
        })}
        <InfiniteList cursor={rows?.[rows.length - 1]?.id} tag={params.name} />
      </section>
    </>
  );
};

export default Tag;
