import { EditorialIntro } from "@/components/homepage/frame";
import {
  editorialTopicKey,
  EditorialTopicNav,
  editorialTopics,
  topicHref,
  topicTitle,
} from "@/components/homepage/topics";
import { ClickAndTrack } from "@/components/website_v2/click";
import { getLetterpadCategories } from "@/components/website_v2/data";

import { EventAction, EventCategory } from "@/track";

export default async function TopicsPage() {
  const response = await getLetterpadCategories();
  const sections = new Map<
    string,
    { title: string; slug: string; count?: number | null }
  >(editorialTopics.map((topic) => [topic.slug, topic]));

  for (const topic of response?.popularTags?.rows ?? []) {
    const slug = topic.slug.split("/").pop();
    if (!slug) continue;
    const key = editorialTopicKey(slug);
    sections.set(key, {
      slug,
      title: sections.get(key)?.title ?? topicTitle(slug),
      count: topic.count,
    });
  }

  return (
    <>
      <EditorialIntro
        title="Topics"
        description="Browse stories by topic from writers across Letterpad."
      />
      <EditorialTopicNav current="topics" />
      <ul className="editorial-topic-directory" aria-label="All topics">
        {[...sections.values()].map(({ title, slug, count }) => (
          <li key={slug}>
            <ClickAndTrack href={topicHref(slug)} trackOptions={{
              eventAction: EventAction.Click,
              eventCategory: EventCategory.Topic,
              eventLabel: title,
            }}>
              <h2>{title}</h2>
              {typeof count === "number" && (
                <span className="editorial-meta">
                  {count} {count === 1 ? "story" : "stories"}
                </span>
              )}
            </ClickAndTrack>
          </li>
        ))}
      </ul>
    </>
  );
}
