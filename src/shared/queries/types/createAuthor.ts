/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: createAuthor
// ====================================================

export interface createAuthor_createAuthor_errors {
  __typename: "Error";
  path: string;
  message: string | null;
}

export interface createAuthor_createAuthor {
  __typename: "CreateAuthorResponse";
  ok: boolean;
  errors: createAuthor_createAuthor_errors[] | null;
}

export interface createAuthor {
  createAuthor: createAuthor_createAuthor | null;
}

export interface createAuthorVariables {
  email: string;
  fname?: string | null;
  lname?: string | null;
  roleId?: number | null;
}
