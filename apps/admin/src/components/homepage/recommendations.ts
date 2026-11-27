export type RecommendationCandidate = {
  id: string;
  authorId: string;
  title: string;
  description: string;
  readingTime: string;
  publishedAt: Date;
};

export type HomepageRecommendations<T extends RecommendationCandidate> = {
  kind: "popular" | "fresh" | "empty";
  stories: T[];
};

const recommendationSize = 3;

export function hasRecommendationQuality(story: RecommendationCandidate) {
  const title = story.title.trim();
  const description = story.description.trim();
  const readingMinutes = Number.parseInt(story.readingTime, 10);
  const looksPromotional =
    /\|\||\b(?:coupon code|discount code|buy now|limited-time offer|sign up today)\b/i.test(
      title
    );

  return (
    title.length >= 18 &&
    description.length >= 60 &&
    Number.isFinite(readingMinutes) &&
    readingMinutes >= 2 &&
    !looksPromotional
  );
}

function uniqueById<T extends RecommendationCandidate>(stories: T[]) {
  const seen = new Set<string>();
  return stories.filter((story) => {
    if (seen.has(story.id)) return false;
    seen.add(story.id);
    return true;
  });
}

export function buildHomepageRecommendations<T extends RecommendationCandidate>(
  popular: T[],
  fresh: T[],
  latest: T[],
  leadId?: string
): HomepageRecommendations<T> {
  const visibleLatest = latest.filter((story) => story.id !== leadId);
  const uniquePopular = uniqueById(popular);
  if (uniquePopular.length >= recommendationSize) {
    return {
      kind: "popular",
      stories: uniquePopular.slice(0, recommendationSize),
    };
  }

  const visibleIds = new Set([leadId, ...latest.map(({ id }) => id)]);
  const freshStories = uniqueById([
    ...fresh.filter(
      (story) => !visibleIds.has(story.id) && hasRecommendationQuality(story)
    ),
    ...visibleLatest.filter(hasRecommendationQuality),
    ...visibleLatest,
  ]);

  return {
    kind: freshStories.length ? "fresh" : "empty",
    stories: freshStories.slice(0, recommendationSize),
  };
}
