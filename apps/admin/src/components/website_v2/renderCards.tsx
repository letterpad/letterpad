import { Skeleton } from "ui/isomorphic";
import { InfiniteList } from "./infinite-list";
import { RenderCard } from "./card";
import { getLetterpadPosts } from "./data";

export const RenderCards = async () => {
  const data = await getLetterpadPosts({ filters: { cursor: "" } });
  const rows =
    data?.letterpadLatestPosts.__typename === "PostsNode"
      ? data.letterpadLatestPosts.rows
      : [];
  return (
    <>
      {rows?.map((post) => <RenderCard key={post.slug} post={post} />)}
      <InfiniteList cursor={rows?.[rows.length - 1]?.id} />
    </>
  );
};

export const RenderCardsPlaceholder = async () => {
  const items = Array.from({ length: 3 });
  return (
    <div className="my-4">
      <ul className="flex gap-5 flex-col divide-y dark:divide-blue-500/30 divide-brand/10">
        {items.map((_, i) => (
          <div className="flex flex-row items-center justify-between" key={i}>
            <div className="flex flex-col">
              <div className="flex-1 md:w-1/2">
                <Skeleton className="w-full h-[300px] md:h-auto rounded-md" />
              </div>
              <div className="p-6 md:p-8 flex flex-col items-start gap-4 md:gap-6">
                <Skeleton className="h-8 w-[200px] rounded-md" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-[400px] rounded-md" />
                  <Skeleton className="h-4 w-[400px] rounded-md" />
                </div>
                <Skeleton className="h-9 w-[120px] rounded-md" />
              </div>
            </div>
            <Skeleton className=" w-[160px] h-40 rounded-md" />
          </div>
        ))}
      </ul>
    </div>
  );
};
