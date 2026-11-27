import { Metadata } from "next";
import Link from "next/link";
import { getServerSession } from "next-auth";

import { EditorialIntro } from "@/components/homepage/frame";
import { EditorialTopicStory } from "@/components/homepage/story";
import { EditorialTopicNav, topicTitle } from "@/components/homepage/topics";
import { getLetterpadPosts } from "@/components/website_v2/data";
import { InfiniteList } from "@/components/website_v2/infinite-list";

import { ROLES } from "@/graphql/types";
import { options } from "@/pages/api/auth/[...nextauth]";

type TopicParams = { params: { name: string } };

function topicDescription(title: string) {
  return `Read the latest stories on ${title.toLowerCase()} from writers across Letterpad.`;
}

export function generateMetadata({ params }: TopicParams): Metadata {
  const title = topicTitle(params.name);
  return {
    title: `${title} | Letterpad`,
    description: topicDescription(title),
  };
}

export default async function TopicPage({ params }: TopicParams) {
  const slug = params.name;
  const title = topicTitle(slug);
  const [data, session] = await Promise.all([
    getLetterpadPosts({ filters: { tag: slug } }),
    getServerSession(options()),
  ]);
  const result = data?.letterpadLatestPosts;
  const rows = result?.__typename === "PostsNode" ? result.rows : [];
  const count = result?.__typename === "PostsNode" ? result.count : 0;
  const canModerate = session?.user?.role === ROLES.ADMIN;

  return (
    <>
      <EditorialIntro title={title} description={topicDescription(title)} />
      <EditorialTopicNav current={{ slug }} />
      <section
        className="editorial-stories editorial-topic-stories"
        aria-labelledby="topic-stories"
      >
        <div className="editorial-latest">
          <h2 id="topic-stories">Latest stories</h2>
          {rows.map((post) => (
            <EditorialTopicStory
              key={post.id}
              post={post}
              canModerate={canModerate}
            />
          ))}
          {!rows.length && (
            <>
              <p className="editorial-meta">No stories in this topic yet.</p>
              <Link className="editorial-more" href="/topics">
                Browse all topics
              </Link>
            </>
          )}
          {rows.length > 0 && rows.length < count && (
            <InfiniteList
              key={slug}
              cursor={rows[rows.length - 1].id}
              tag={slug}
              editorial={{ initialCount: rows.length, canModerate }}
            />
          )}
        </div>
      </section>
    </>
  );
}
