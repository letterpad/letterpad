/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: getAuthors
// ====================================================

export interface getAuthors_authors_role_permissions {
  __typename: "Permission";
  name: string | null;
}

export interface getAuthors_authors_role {
  __typename: "Role";
  name: string | null;
  permissions: (getAuthors_authors_role_permissions | null)[] | null;
}

export interface getAuthors_authors {
  __typename: "Author";
  id: number | null;
  email: string | null;
  fname: string | null;
  lname: string | null;
  username: string | null;
  avatar: string | null;
  bio: string | null;
  role: getAuthors_authors_role | null;
}

export interface getAuthors {
  authors: (getAuthors_authors | null)[] | null;
}
