/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { SinglePostFilters, TaxonomyTypes } from "./../../../../types/globalTypes";

// ====================================================
// GraphQL query operation: post
// ====================================================

export interface post_post_author {
  __typename: "Author";
  fname: string;
  lname: string;
  avatar: string | null;
  bio: string;
}

export interface post_post_taxonomies {
  __typename: "Taxonomy";
  id: number;
  name: string;
  type: TaxonomyTypes;
  slug: string;
}

export interface post_post {
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
  author: post_post_author | null;
  taxonomies: (post_post_taxonomies | null)[] | null;
}

export interface post {
  post: post_post | null;
}

export interface postVariables {
  filters?: SinglePostFilters | null;
}
