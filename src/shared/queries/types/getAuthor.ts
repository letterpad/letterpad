/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: getAuthor
// ====================================================

export interface getAuthor_author_role_permissions {
  __typename: "Permission";
  name: string | null;
}

export interface getAuthor_author_role {
  __typename: "Role";
  name: string | null;
  permissions: (getAuthor_author_role_permissions | null)[] | null;
}

export interface getAuthor_author {
  __typename: "Author";
  id: number | null;
  username: string | null;
  email: string | null;
  fname: string | null;
  lname: string | null;
  social: string | null;
  avatar: string | null;
  bio: string | null;
  role: getAuthor_author_role | null;
}

export interface getAuthor {
  author: getAuthor_author | null;
}

export interface getAuthorVariables {
  id: number;
}
