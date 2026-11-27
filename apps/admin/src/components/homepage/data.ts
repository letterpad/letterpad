import { Prisma } from "@prisma/client";
import { PostStatusOptions, PostTypes } from "letterpad-graphql";

import { prisma } from "@/lib/prisma";

import { getRootUrl } from "@/shared/getRootUrl";
import { isPostgresDb } from "@/utils/utils";

import {
  buildHomepageRecommendations,
  hasRecommendationQuality,
} from "./recommendations";

const storySelect = {
  id: true,
  title: true,
  slug: true,
  author: {
    select: {
      id: true,
      name: true,
      favourite: true,
      username: true,
      setting: { select: { site_url: true } },
    },
  },
  sub_title: true,
  excerpt: true,
  reading_time: true,
  cover_image: true,
  publishedAt: true,
} satisfies Prisma.PostSelect;

const publicStories = {
  status: PostStatusOptions.Published,
  type: PostTypes.Post,
  banned: false,
  exclude_from_home: false,
  slug: { not: "" },
  html: { not: "" },
  NOT: [{ title: "" }, { title: "Coming Soon" }],
} satisfies Prisma.PostWhereInput;

type StoryRow = Prisma.PostGetPayload<{ select: typeof storySelect }>;

function pageUrl(value: string, base?: string) {
  try {
    const url = new URL(value, base);
    if (
      (url.protocol === "https:" || url.protocol === "http:") &&
      !url.username &&
      !url.password
    ) {
      return url.href;
    }
  } catch {
    return;
  }
}

function storyFromRow(row: StoryRow) {
  if (!row.author || !row.publishedAt) return null;
  const { id: authorId, name, username, favourite, setting } = row.author;
  const domain = new URL(getRootUrl()).host;
  const site = setting?.site_url || `https://${username}.${domain}`;
  const baseUrl = pageUrl(
    /^https?:\/\//i.test(site) ? site : `https://${site}`
  );
  if (!baseUrl) return null;
  const url = pageUrl(`/post/${encodeURIComponent(row.slug)}`, baseUrl);
  if (!url) return null;
  const cover = row.cover_image
    ? pageUrl(row.cover_image, getRootUrl())
    : undefined;

  const readingTime = row.reading_time.replace(/\bmins?\b/i, "min").trim();
  return {
    id: row.id,
    title: row.title,
    url,
    cover,
    description: (row.sub_title || row.excerpt).trim(),
    author: name || username,
    authorId,
    favourite,
    authorHref: `/@${encodeURIComponent(username)}`,
    readingTime:
      readingTime &&
      (/\bread\b/i.test(readingTime) ? readingTime : readingTime + " read"),
    publishedAt: row.publishedAt,
  };
}

export type HomepageStory = NonNullable<ReturnType<typeof storyFromRow>>;

async function getNewsroomPick() {
  const endpoint = process.env.NEWSROOM_HOMEPAGE_URL;
  if (!endpoint) return null;

  try {
    const url = new URL(endpoint);
    if (url.protocol !== "https:" && process.env.NODE_ENV === "production")
      return null;
    const response = await fetch(url, {
      redirect: "error",
      signal: AbortSignal.timeout(1500),
      next: { revalidate: 60 },
    });
    if (!response.ok) return null;
    const data = await response.json();
    const updated = Date.parse(data.updatedAt);
    const now = Date.now();
    if (
      data.version !== 1 ||
      !Number.isFinite(updated) ||
      updated > now + 60_000 ||
      updated < now - 36 * 3_600_000 ||
      typeof data.editorPickId !== "string" ||
      !/^[\w-]{1,100}$/.test(data.editorPickId)
    )
      return null;
    return data.editorPickId as string;
  } catch {
    return null;
  }
}

const latestPageSize = 10;
const minimumEngagedVisits = 5;

function pickPopularStories(
  rows: Array<{ post: StoryRow; views: number }>,
  excludedIds: Set<string>
) {
  const byPost = new Map<string, { story: HomepageStory; views: number }>();
  for (const { post, views } of rows) {
    if (views < minimumEngagedVisits || excludedIds.has(post.id)) continue;
    const story = storyFromRow(post);
    if (!story || !hasRecommendationQuality(story)) continue;

    const previous = byPost.get(story.id);
    if (!previous || views > previous.views)
      byPost.set(story.id, { story, views });
  }

  // Limit repeat exposure from a single author when several posts are popular.
  const authors = new Set<string>();
  return [...byPost.values()]
    .sort(
      (a, b) =>
        b.views - a.views ||
        b.story.publishedAt.getTime() - a.story.publishedAt.getTime()
    )
    .filter(({ story }) => {
      if (authors.has(story.authorId)) return false;
      authors.add(story.authorId);
      return true;
    })
    .slice(0, 3)
    .map(({ story }) => story);
}

export async function getHomepageStories(cursor?: string) {
  const currentTime = new Date();
  const where = { ...publicStories, publishedAt: { lte: currentTime } };
  const popularWhere = { ...where, excerpt: { not: "" } };
  const pickPromise = cursor ? Promise.resolve(null) : getNewsroomPick();
  const latestPromise = prisma.post.findMany({
    where,
    select: storySelect,
    orderBy: [{ publishedAt: "desc" }, { id: "desc" }],
    take: latestPageSize + 1,
    ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
  });
  const popularPromise = cursor
    ? Promise.resolve([])
    : prisma.trending.findMany({
        where: { post: popularWhere },
        orderBy: [{ views: "desc" }, { updatedAt: "desc" }],
        take: 40,
        select: { views: true, post: { select: storySelect } },
      });
  const fallbackPromise = cursor
    ? Promise.resolve([])
    : prisma.post.findMany({
        where,
        select: storySelect,
        orderBy: [{ publishedAt: "desc" }, { id: "desc" }],
        skip: latestPageSize + 1,
        take: 9,
      });
  const [latestRows, popularRows, fallbackRows, pickId] = await Promise.all([
    latestPromise,
    popularPromise,
    fallbackPromise,
    pickPromise,
  ]);
  const latest = latestRows
    .slice(0, latestPageSize)
    .map(storyFromRow)
    .filter((story): story is HomepageStory => !!story);
  const newsroomRow = pickId
    ? (latestRows.find(({ id }) => id === pickId) ??
      (await prisma.post.findFirst({
        where: { ...where, id: pickId },
        select: storySelect,
      })))
    : null;
  const newsroomPick = newsroomRow && storyFromRow(newsroomRow);
  const lead = cursor ? null : (newsroomPick ?? latest[0] ?? null);
  const visibleIds = new Set([
    ...(lead ? [lead.id] : []),
    ...latest.map(({ id }) => id),
  ]);
  const popular = pickPopularStories(popularRows, visibleIds);

  // If the engagement and substance bar leaves too few candidates, use recent
  // posts instead. If there are fewer than three posts overall, reuse the
  // latest feed as the final backstop so this area never collapses or vanishes.
  const fallbackStories = fallbackRows
    .map(storyFromRow)
    .filter(
      (story): story is HomepageStory =>
        !!story && !visibleIds.has(story.id) && hasRecommendationQuality(story)
    );
  const recommendations = buildHomepageRecommendations(
    popular,
    fallbackStories,
    latest,
    lead?.id
  );

  return {
    lead,
    leadIsPick: !!newsroomPick,
    latest: latest.filter(({ id }) => id !== lead?.id),
    recommendations,
    nextCursor:
      latestRows.length > latestPageSize
        ? latestRows[latestPageSize - 1].id
        : null,
  };
}

export async function searchHomepageStories(query: string) {
  const term = typeof query === "string" ? query.trim().slice(0, 120) : "";
  if (term.length < 2) return [];
  const match = {
    contains: term,
    ...(isPostgresDb() ? { mode: "insensitive" as const } : {}),
  };
  const rows = await prisma.post.findMany({
    where: {
      ...publicStories,
      publishedAt: { lte: new Date() },
      OR: [{ title: match }, { excerpt: match }],
    },
    select: storySelect,
    orderBy: [{ publishedAt: "desc" }, { id: "desc" }],
    take: 12,
  });
  return rows
    .map(storyFromRow)
    .filter((story): story is HomepageStory => !!story);
}
