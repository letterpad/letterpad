/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: updateAuthor
// ====================================================

export interface updateAuthor_updateAuthor_errors {
  __typename: "Error";
  path: string;
  message: string | null;
}

export interface updateAuthor_updateAuthor {
  __typename: "AuthorResponse";
  ok: boolean;
  errors: updateAuthor_updateAuthor_errors[] | null;
}

export interface updateAuthor {
  updateAuthor: updateAuthor_updateAuthor | null;
}

export interface updateAuthorVariables {
  id: number;
  email?: string | null;
  fname?: string | null;
  lname?: string | null;
  password?: string | null;
  username?: string | null;
  social?: string | null;
  avatar?: string | null;
  roleId?: number | null;
  bio?: string | null;
}
