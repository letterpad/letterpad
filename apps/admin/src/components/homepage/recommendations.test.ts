import {
  buildHomepageRecommendations,
  hasRecommendationQuality,
  RecommendationCandidate,
} from "./recommendations";

function story(id: string, overrides: Partial<RecommendationCandidate> = {}) {
  return {
    id,
    authorId: `author-${id}`,
    title: `A thoughtful story about ${id}`,
    description:
      "A useful summary with enough detail to help a reader decide whether to open this story.",
    readingTime: "3 min read",
    publishedAt: new Date("2026-11-27T12:00:00Z"),
    ...overrides,
  };
}

describe("buildHomepageRecommendations", () => {
  it("requires substance signals before a post can be called popular", () => {
    expect(hasRecommendationQuality(story("long-enough"))).toBe(true);
    expect(
      hasRecommendationQuality(
        story("thin", { readingTime: "1 min read", description: "Short." })
      )
    ).toBe(false);
    expect(
      hasRecommendationQuality(
        story("promo", { title: "Product review || best deals in minutes" })
      )
    ).toBe(false);
  });

  it("fills the section with recent stories when too few posts meet the popular bar", () => {
    const latest = [story("lead"), story("latest-1"), story("latest-2")];
    const recommendations = buildHomepageRecommendations(
      [story("popular-1")],
      [story("fresh-1"), story("fresh-2"), story("fresh-3")],
      latest,
      "lead"
    );

    expect(recommendations.kind).toBe("fresh");
    expect(recommendations.stories.map(({ id }) => id)).toEqual([
      "fresh-1",
      "fresh-2",
      "fresh-3",
    ]);
  });

  it("falls back to the latest feed when there are not enough older stories", () => {
    const recommendations = buildHomepageRecommendations(
      [],
      [],
      [story("lead"), story("latest-1"), story("latest-2")],
      "lead"
    );

    expect(recommendations.kind).toBe("fresh");
    expect(recommendations.stories.map(({ id }) => id)).toEqual([
      "latest-1",
      "latest-2",
    ]);
  });

  it("returns an explicit topic link state when there are no published stories", () => {
    expect(buildHomepageRecommendations([], [], [])).toEqual({
      kind: "empty",
      stories: [],
    });
  });
});
