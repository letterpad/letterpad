/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { InputUpdatePost } from "./../../../../types/globalTypes";

// ====================================================
// GraphQL mutation operation: updatePost
// ====================================================

export interface updatePost_updatePost_errors {
  __typename: "Error";
  path: string;
  message: string | null;
}

export interface updatePost_updatePost_post_author {
  __typename: "Author";
  username: string | null;
  lname: string | null;
  fname: string | null;
  avatar: string | null;
  bio: string | null;
}

export interface updatePost_updatePost_post_taxonomies {
  __typename: "Taxonomy";
  id: number | null;
  name: string | null;
  type: string | null;
  slug: string | null;
}

export interface updatePost_updatePost_post {
  __typename: "Post";
  id: number | null;
  title: string | null;
  body: string | null;
  author: updatePost_updatePost_post_author | null;
  slug: string | null;
  type: string | null;
  status: string | null;
  excerpt: string | null;
  mode: string | null;
  createdAt: any | null;
  cover_image: string | null;
  taxonomies: (updatePost_updatePost_post_taxonomies | null)[] | null;
}

export interface updatePost_updatePost {
  __typename: "Response";
  ok: boolean;
  errors: updatePost_updatePost_errors[] | null;
  post: updatePost_updatePost_post | null;
}

export interface updatePost {
  updatePost: updatePost_updatePost;
}

export interface updatePostVariables {
  data?: InputUpdatePost | null;
}
