/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: searchPosts
// ====================================================

export interface searchPosts_posts_rows_author {
  __typename: "Author";
  fname: string | null;
  lname: string | null;
  avatar: string | null;
  bio: string | null;
}

export interface searchPosts_posts_rows_taxonomies {
  __typename: "Taxonomy";
  id: number | null;
  name: string | null;
  type: string | null;
  slug: string | null;
}

export interface searchPosts_posts_rows {
  __typename: "Post";
  id: number | null;
  title: string | null;
  body: string | null;
  status: string | null;
  createdAt: any | null;
  publishedAt: any | null;
  excerpt: string | null;
  cover_image: string | null;
  slug: string | null;
  mode: string | null;
  type: string | null;
  author: searchPosts_posts_rows_author | null;
  taxonomies: (searchPosts_posts_rows_taxonomies | null)[] | null;
}

export interface searchPosts_posts {
  __typename: "PostNode";
  count: number | null;
  rows: (searchPosts_posts_rows | null)[] | null;
}

export interface searchPosts {
  posts: searchPosts_posts | null;
}

export interface searchPostsVariables {
  type?: string | null;
  query: string;
  offset?: number | null;
  limit?: number | null;
  status?: string | null;
}
