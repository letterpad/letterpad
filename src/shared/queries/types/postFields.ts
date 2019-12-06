/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: postFields
// ====================================================

export interface postFields_author {
  __typename: "Author";
  fname: string | null;
  lname: string | null;
  avatar: string | null;
  bio: string | null;
}

export interface postFields_taxonomies {
  __typename: "Taxonomy";
  id: number | null;
  name: string | null;
  type: string | null;
  slug: string | null;
}

export interface postFields {
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
  author: postFields_author | null;
  taxonomies: (postFields_taxonomies | null)[] | null;
}
