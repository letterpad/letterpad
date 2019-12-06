/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: deletePosts
// ====================================================

export interface deletePosts_deletePosts {
  __typename: "Response";
  ok: boolean;
}

export interface deletePosts {
  deletePosts: deletePosts_deletePosts;
}

export interface deletePostsVariables {
  ids?: number[] | null;
  deleteFromSystem?: boolean | null;
}
