/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { InputCreatePost } from "./../../../../types/globalTypes";

// ====================================================
// GraphQL mutation operation: createPost
// ====================================================

export interface createPost_createPost_errors {
  __typename: "Error";
  path: string;
  message: string | null;
}

export interface createPost_createPost_post_author {
  __typename: "Author";
  username: string | null;
}

export interface createPost_createPost_post_taxonomies {
  __typename: "Taxonomy";
  id: number | null;
  name: string | null;
  type: string | null;
}

export interface createPost_createPost_post {
  __typename: "Post";
  id: number | null;
  title: string | null;
  body: string | null;
  author: createPost_createPost_post_author | null;
  status: string | null;
  type: string | null;
  slug: string | null;
  mode: string | null;
  excerpt: string | null;
  createdAt: any | null;
  cover_image: string | null;
  taxonomies: (createPost_createPost_post_taxonomies | null)[] | null;
}

export interface createPost_createPost {
  __typename: "Response";
  ok: boolean;
  errors: createPost_createPost_errors[] | null;
  post: createPost_createPost_post | null;
}

export interface createPost {
  createPost: createPost_createPost;
}

export interface createPostVariables {
  data?: InputCreatePost | null;
}
