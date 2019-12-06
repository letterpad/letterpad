/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: stats
// ====================================================

export interface stats_stats_posts {
  __typename: "PostStatus";
  published: number | null;
  drafts: number | null;
}

export interface stats_stats_pages {
  __typename: "PostStatus";
  published: number | null;
  drafts: number | null;
}

export interface stats_stats {
  __typename: "Stats";
  posts: stats_stats_posts | null;
  pages: stats_stats_pages | null;
  tags: number | null;
  categories: number | null;
}

export interface stats {
  stats: stats_stats | null;
}
