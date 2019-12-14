/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { EnumRoles } from "./../../../../types/globalTypes";

// ====================================================
// GraphQL query operation: getAuthor
// ====================================================

export interface getAuthor_author_social {
  __typename: "TypeSocial";
  facebook: string | null;
  instagram: string | null;
  github: string | null;
  twitter: string | null;
}

export interface getAuthor_author_role_permissions {
  __typename: "Permission";
  name: string;
}

export interface getAuthor_author_role {
  __typename: "Role";
  name: EnumRoles | null;
  permissions: (getAuthor_author_role_permissions | null)[] | null;
}

export interface getAuthor_author {
  __typename: "Author";
  id: number;
  username: string;
  email: string;
  fname: string;
  lname: string;
  social: getAuthor_author_social;
  avatar: string | null;
  bio: string;
  role: getAuthor_author_role;
}

export interface getAuthor {
  author: getAuthor_author;
}

export interface getAuthorVariables {
  id: number;
}
