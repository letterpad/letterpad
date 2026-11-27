import Link from "next/link";

import { beautifyTopic, TOPIC_PREFIX } from "@/shared/utils";

export const editorialTopics = [
  { title: "Technology", slug: "_topic_technology" },
  { title: "Culture", slug: "_topic_entertainment" },
  { title: "Travel", slug: "_topic_travel-&-adventure" },
  { title: "Photography", slug: "_topic_photography" },
  { title: "Writing", slug: "_topic_literature" },
];

export function editorialTopicKey(slug: string) {
  const key = slug.toLowerCase();
  return (
    editorialTopics.find(
      (topic) =>
        topic.slug === key || topic.slug.slice(TOPIC_PREFIX.length) === key
    )?.slug ?? key
  );
}

export function topicTitle(slug: string) {
  return (
    editorialTopics.find((topic) => topic.slug === editorialTopicKey(slug))
      ?.title ?? beautifyTopic(slug)
  );
}

export function topicHref(slug: string) {
  return `/tag/${encodeURIComponent(slug)}`;
}

export function EditorialTopicNav({
  current,
}: {
  current?: { slug: string } | "topics";
}) {
  const slug = typeof current === "object" ? current.slug : undefined;
  const selected = slug ? editorialTopicKey(slug) : undefined;
  const topics =
    slug && !editorialTopics.some((topic) => topic.slug === selected)
      ? [...editorialTopics, { title: topicTitle(slug), slug }]
      : editorialTopics;

  return (
    <nav className="editorial-topics" aria-label="Story topics">
      <Link href="/" aria-current={current === undefined ? "page" : undefined}>
        All stories
      </Link>
      {topics.map((topic) => (
        <Link
          key={topic.slug}
          href={topicHref(
            slug && topic.slug.toLowerCase() === selected ? slug : topic.slug
          )}
          prefetch={false}
          aria-current={
            topic.slug.toLowerCase() === selected ? "page" : undefined
          }
        >
          {topic.title}
        </Link>
      ))}
      <Link
        href="/topics"
        aria-current={current === "topics" ? "page" : undefined}
      >
        All topics
      </Link>
    </nav>
  );
}
