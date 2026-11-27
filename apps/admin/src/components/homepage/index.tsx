import localFont from "next/font/local";
import Link from "next/link";
import { getServerSession } from "next-auth";

import "./homepage.css";

import { AdminActions } from "@/components/website_v2/adminActions";

import { Ads } from "@/app/ads";
import { ROLES } from "@/graphql/types";
import { options } from "@/pages/api/auth/[...nextauth]";

import { getHomepageStories, HomepageStory } from "./data";
import { HomepageHeader } from "./header";

const literata = localFont({
  src: "../../../../../packages/config/fonts/literata.woff2",
  weight: "200 900",
  display: "swap",
  variable: "--editorial-serif",
  fallback: ["Georgia", "serif"],
  adjustFontFallback: false,
});

const geist = localFont({
  src: "../../../../../packages/config/fonts/geist.woff2",
  weight: "100 900",
  display: "swap",
  variable: "--editorial-sans",
  fallback: ["system-ui", "sans-serif"],
  adjustFontFallback: false,
});

const topics = [
  ["Technology", "_topic_technology"],
  ["Culture", "_topic_entertainment"],
  ["Travel", "_topic_travel-&-adventure"],
  ["Photography", "_topic_photography"],
  ["Writing", "_topic_literature"],
];

function StoryMeta({ story, canModerate }: { story: HomepageStory; canModerate?: boolean }) {
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
        <AdminActions id={story.id} authorId={story.authorId} banned={false} isFavourite={story.favourite} />
      )}
    </div>
  );
}

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

function Trending({ stories }: { stories: HomepageStory[] }) {
  if (!stories.length) return null;
  return (
    <section
      className="editorial-trending"
      aria-labelledby="editorial-trending-label"
    >
      <h2 id="editorial-trending-label">Trending</h2>
      <ul>
        {stories.map((story) => (
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
    </section>
  );
}

export async function Homepage({ cursor }: { cursor?: string }) {
  const [{ lead, leadIsPick, trending, latest, nextCursor }, session] = await Promise.all([
    getHomepageStories(cursor),
    getServerSession(options()),
  ]);
  const canModerate = session?.user?.role === ROLES.ADMIN;
  const clientId = process.env.ADSENSE_CLIENT_ID;
  const adSlot = process.env.LETTERPAD_HOMEPAGE_AD_SLOT;
  const enableAd = !!clientId && !!adSlot && !cursor;

  return (
    <div className={`editorial-home ${literata.variable} ${geist.variable}`}>
      <HomepageHeader />
      <main className="editorial-frame">
        <div className="editorial-intro">
          <h1>Discover independent writing</h1>
          <p>Read stories from writers across Letterpad.</p>
        </div>
        <nav className="editorial-topics" aria-label="Story topics">
          <Link href="/" aria-current="page">
            All stories
          </Link>
          {topics.map(([title, slug]) => (
            <Link
              prefetch={false}
              key={slug}
              href={`/tag/${encodeURIComponent(slug)}`}
            >
              {title}
            </Link>
          ))}
          <Link href="/topics">All topics</Link>
        </nav>
        <div
          className="editorial-stories"
          data-has-rail={!!trending.length || enableAd}
        >
          <div className="editorial-main-column">
            {lead && <LeadStory story={lead} isPick={leadIsPick} canModerate={canModerate} />}
            <section
              className="editorial-latest"
              aria-labelledby="latest-stories"
            >
              <h2 id="latest-stories">Latest stories</h2>
              {latest.map((story) => (
                <article key={story.id}>
                  <div>
                    <h3>
                      <Link href={story.url} prefetch={false}>
                        {story.title}
                      </Link>
                    </h3>
                    <StoryMeta story={story} canModerate={canModerate} />
                  </div>
                  {story.cover && (
                    <img
                      alt=""
                      src={story.cover}
                      loading="lazy"
                      decoding="async"
                    />
                  )}
                </article>
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
          {(!!trending.length || enableAd) && (
            <aside className="editorial-rail" aria-label="More from Letterpad">
              <Trending stories={trending} />
              {enableAd && (
                <div className="editorial-ad">
                  <p>Advertisement</p>
                  <Ads clientId={clientId!} slot={adSlot!} />
                </div>
              )}
            </aside>
          )}
        </div>
      </main>
      <footer className="editorial-footer">
        <div className="editorial-frame">
          <Link href="/terms">Terms</Link>
          <Link href="/privacy">Privacy</Link>
          <a href="https://github.com/letterpad/letterpad">Contribute</a>
        </div>
      </footer>
    </div>
  );
}
