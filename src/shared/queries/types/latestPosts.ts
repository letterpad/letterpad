/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: latestPosts
// ====================================================

export interface latestPosts_posts_rows {
  __typename: "Post";
  id: number | null;
  title: string | null;
  type: string | null;
  slug: string | null;
  createdAt: any | null;
  publishedAt: any | null;
  cover_image: string | null;
}

export interface latestPosts_posts {
  __typename: "PostNode";
  count: number | null;
  rows: (latestPosts_posts_rows | null)[] | null;
}

export interface latestPosts {
  posts: latestPosts_posts | null;
}

export interface latestPostsVariables {
  type?: string | null;
  limit?: number | null;
}
