import { Card } from "@/components/website_v2/card";
import { getLetterpadPosts } from "@/components/website_v2/data";
import { InfiniteList } from "@/components/website_v2/infinite-list";

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
      <section className="w-full mb-5 flex flex-col overflow-hidden">
        {rows.map((item) => {
          const author =
            item.author?.__typename === "Author" ? item.author : null;
          try {
            const link = new URL(
              item.slug ?? "",
              `https://${author?.username}.letterpad.app`
            ).toString();
            return (
              <Card
                key={item.id}
                {...item}
                link={link}
                slug={link}
                author={author!}
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
