/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: authors
// ====================================================

export interface authors_authors_role_permissions {
  __typename: "Permission";
  name: string | null;
}

export interface authors_authors_role {
  __typename: "Role";
  name: string | null;
  permissions: (authors_authors_role_permissions | null)[] | null;
}

export interface authors_authors {
  __typename: "Author";
  id: number;
  email: string;
  fname: string;
  lname: string;
  username: string;
  avatar: string | null;
  bio: string;
  role: authors_authors_role;
}

export interface authors {
  authors: authors_authors[];
}
