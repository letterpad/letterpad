import Link from "next/link";
import { getServerSession } from "next-auth";

import { Ads } from "@/app/ads";
import { ROLES } from "@/graphql/types";
import { options } from "@/pages/api/auth/[...nextauth]";

import { getHomepageStories, HomepageStory } from "./data";
import { EditorialFrame, EditorialIntro } from "./frame";
import { EditorialStoryRow, StoryMeta } from "./story";
import { EditorialTopicNav } from "./topics";

function LeadStory({
  story,
  isPick,
  canModerate,
}: {
  story: HomepageStory;
  isPick: boolean;
  canModerate: boolean;
}) {
  return (
    <section className="editorial-lead" aria-labelledby="editorial-lead-label">
      <h2 id="editorial-lead-label">
        {isPick ? "Editor’s pick" : "Latest story"}
      </h2>
      <article>
        <Link href={story.url} prefetch={false} className="editorial-lead-link">
          {story.cover && (
            <img
              src={story.cover}
              alt=""
              fetchPriority="high"
              decoding="async"
              className="editorial-lead-cover"
            />
          )}
          <h3>{story.title}</h3>
        </Link>
        {story.description && (
          <p className="editorial-excerpt">{story.description}</p>
        )}
        <StoryMeta story={story} canModerate={canModerate} />
      </article>
    </section>
  );
}

function ReaderDiscovery({
  recommendations,
}: {
  recommendations: {
    kind: "popular" | "fresh" | "empty";
    stories: HomepageStory[];
  };
}) {
  const title =
    recommendations.kind === "popular"
      ? "Popular with readers"
      : recommendations.kind === "fresh"
        ? "Fresh stories to explore"
        : "Explore a topic";

  return (
    <section
      className="editorial-discovery"
      aria-labelledby="editorial-discovery-label"
    >
      <h2 id="editorial-discovery-label">{title}</h2>
      <p className="editorial-discovery-note">
        {recommendations.kind === "popular"
          ? "Substantive posts with the most engaged visits over the last two weeks."
          : recommendations.kind === "fresh"
            ? "Recent posts while more reader signals build."
            : "New stories are on their way. Browse a topic in the meantime."}
      </p>
      {recommendations.stories.length ? (
        <ul>
          {recommendations.stories.map((story) => (
            <li key={story.id}>
              <h3>
                <Link href={story.url} prefetch={false}>
                  {story.title}
                </Link>
              </h3>
              <StoryMeta story={story} />
            </li>
          ))}
        </ul>
      ) : (
        <Link className="editorial-more" href="/topics">
          Browse topics
        </Link>
      )}
    </section>
  );
}

export async function Homepage({ cursor }: { cursor?: string }) {
  const [{ lead, leadIsPick, recommendations, latest, nextCursor }, session] =
    await Promise.all([
      getHomepageStories(cursor),
      getServerSession(options()),
    ]);
  const canModerate = session?.user?.role === ROLES.ADMIN;
  const clientId = process.env.ADSENSE_CLIENT_ID;
  const adSlot = process.env.LETTERPAD_HOMEPAGE_AD_SLOT;
  const enableAd = !!clientId && !!adSlot && !cursor;

  return (
    <EditorialFrame section="discover">
      <EditorialIntro
        title="Discover independent writing"
        description="Read stories from writers across Letterpad."
      />
      <EditorialTopicNav />
      <div className="editorial-stories" data-has-rail={!cursor || enableAd}>
        <div className="editorial-main-column">
          {lead && (
            <LeadStory
              story={lead}
              isPick={leadIsPick}
              canModerate={canModerate}
            />
          )}
          <section
            className="editorial-latest"
            aria-labelledby="latest-stories"
          >
            <h2 id="latest-stories">Latest stories</h2>
            {latest.map((story) => (
              <EditorialStoryRow
                key={story.id}
                story={story}
                canModerate={canModerate}
              />
            ))}
            {!latest.length && !lead && (
              <p className="editorial-meta">
                {cursor
                  ? "You’ve reached the end of the latest stories."
                  : "Stories will appear here as writers publish them."}
              </p>
            )}
            {nextCursor && (
              <Link
                className="editorial-more"
                href={{
                  pathname: "/",
                  query: { before: nextCursor },
                  hash: "latest-stories",
                }}
              >
                Older stories
              </Link>
            )}
            {cursor && (
              <Link className="editorial-more" href="/#latest-stories">
                Back to latest
              </Link>
            )}
          </section>
        </div>
        {(!cursor || enableAd) && (
          <aside className="editorial-rail" aria-label="More from Letterpad">
            {!cursor && <ReaderDiscovery recommendations={recommendations} />}
            {enableAd && (
              <div className="editorial-ad">
                <p>Advertisement</p>
                <Ads clientId={clientId!} slot={adSlot!} />
              </div>
            )}
          </aside>
        )}
      </div>
    </EditorialFrame>
  );
}
