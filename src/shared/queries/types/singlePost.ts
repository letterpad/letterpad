/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: singlePost
// ====================================================

export interface singlePost_post_author {
  __typename: "Author";
  fname: string | null;
  lname: string | null;
  avatar: string | null;
  bio: string | null;
}

export interface singlePost_post_taxonomies {
  __typename: "Taxonomy";
  id: number | null;
  name: string | null;
  type: string | null;
  slug: string | null;
}

export interface singlePost_post {
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
  author: singlePost_post_author | null;
  taxonomies: (singlePost_post_taxonomies | null)[] | null;
}

export interface singlePost {
  post: singlePost_post | null;
}

export interface singlePostVariables {
  type?: string | null;
  slug?: string | null;
}
