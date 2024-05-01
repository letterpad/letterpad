import { RenderCard } from "@/components/website_v2/card";
import {
  getLetterpadCategories,
  getLetterpadPosts,
} from "@/components/website_v2/data";
import { InfiniteList } from "@/components/website_v2/infinite-list";
import { Topics } from "@/components/website_v2/topics";

const Tag = async ({ params }: { params: { name: string } }) => {
  const [data, response] = await Promise.all([
    getLetterpadPosts({
      filters: { tag: decodeURIComponent(params.name), cursor: "" },
    }),
    getLetterpadCategories(),
  ]);

  const rows =
    data?.letterpadLatestPosts.__typename === "PostsNode"
      ? data.letterpadLatestPosts.rows
      : [];

  const topics = response?.popularTags?.rows;
  return (
    <div className="flex flex-col py-10">
      <h1 className="text-xl py-10 text-center font-heading">
        Explore what matters to you
      </h1>
      <Topics topics={topics!} selected={params.name} />
      <section className="w-full mb-5 flex flex-col overflow-hidden gap-8 my-20 max-w-3xl mx-auto">
        {rows.map((item) => (
          <RenderCard key={item.slug} post={item} />
        ))}
        <InfiniteList cursor={rows?.[rows.length - 1]?.id} tag={params.name} />
      </section>
    </div>
  );
};

export default Tag;
