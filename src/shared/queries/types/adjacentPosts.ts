/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: adjacentPosts
// ====================================================

export interface adjacentPosts_adjacentPosts_next {
  __typename: "Post";
  title: string | null;
  slug: string | null;
  cover_image: string | null;
  publishedAt: any | null;
}

export interface adjacentPosts_adjacentPosts_previous {
  __typename: "Post";
  title: string | null;
  slug: string | null;
  cover_image: string | null;
  publishedAt: any | null;
}

export interface adjacentPosts_adjacentPosts {
  __typename: "AdjacentPosts";
  next: adjacentPosts_adjacentPosts_next | null;
  previous: adjacentPosts_adjacentPosts_previous | null;
}

export interface adjacentPosts {
  adjacentPosts: adjacentPosts_adjacentPosts | null;
}

export interface adjacentPostsVariables {
  slug?: string | null;
}
