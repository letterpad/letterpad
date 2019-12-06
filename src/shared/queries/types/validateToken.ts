/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: validateToken
// ====================================================

export interface validateToken_validateToken_errors {
  __typename: "Error";
  message: string | null;
}

export interface validateToken_validateToken {
  __typename: "CreateAuthorResponse";
  ok: boolean;
  errors: validateToken_validateToken_errors[] | null;
}

export interface validateToken {
  validateToken: validateToken_validateToken | null;
}
