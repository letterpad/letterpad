import { LetterpadLatestPostsQuery } from "letterpad-graphql";
import Link from "next/link";

import { AdminActions } from "@/components/website_v2/adminActions";

type EditorialStory = {
  id: string;
  title: string;
  url: string;
  cover?: string;
  author: string;
  authorId: string;
  authorHref: string;
  favourite?: boolean | null;
  readingTime: string;
};

export type TopicStoryRow = Extract<
  LetterpadLatestPostsQuery["letterpadLatestPosts"],
  { __typename: "PostsNode" }
>["rows"][number];

export function StoryMeta({
  story,
  canModerate,
}: {
  story: EditorialStory;
  canModerate?: boolean;
}) {
  return (
    <div className="editorial-meta">
      <Link href={story.authorHref} prefetch={false}>
        {story.author}
      </Link>
      {story.readingTime && (
        <>
          <span aria-hidden="true">·</span>
          <span>{story.readingTime}</span>
        </>
      )}
      {canModerate && (
        <AdminActions
          id={story.id}
          authorId={story.authorId}
          banned={false}
          isFavourite={!!story.favourite}
        />
      )}
    </div>
  );
}

export function EditorialStoryRow({
  story,
  canModerate,
}: {
  story: EditorialStory;
  canModerate?: boolean;
}) {
  return (
    <article>
      <div>
        <h3>
          <Link href={story.url} prefetch={false}>
            {story.title}
          </Link>
        </h3>
        <StoryMeta story={story} canModerate={canModerate} />
      </div>
      {story.cover && (
        <img alt="" src={story.cover} loading="lazy" decoding="async" />
      )}
    </article>
  );
}

export function EditorialTopicStory({
  post,
  canModerate,
}: {
  post: TopicStoryRow;
  canModerate?: boolean;
}) {
  const author = post.author;
  if (
    author?.__typename !== "Author" ||
    !author.site_url ||
    !author.username ||
    !post.slug
  )
    return null;
  let url: URL;
  try {
    url = new URL(post.slug, author.site_url);
  } catch {
    return null;
  }
  if (url.protocol !== "https:" && url.protocol !== "http:") return null;
  const minutes = parseInt(post.stats?.reading_time ?? "", 10);
  return (
    <EditorialStoryRow
      canModerate={canModerate}
      story={{
        id: post.id,
        title: post.title,
        url: url.href,
        cover: post.cover_image.src ?? undefined,
        author: author.name || author.username,
        authorId: author.id,
        authorHref: `/@${encodeURIComponent(author.username)}`,
        favourite: author.favourite,
        readingTime: minutes > 0 ? `${minutes} min read` : "",
      }}
    />
  );
}
