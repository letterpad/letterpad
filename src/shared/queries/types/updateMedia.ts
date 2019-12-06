/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: updateMedia
// ====================================================

export interface updateMedia_updateMedia_errors {
  __typename: "Error";
  message: string | null;
  path: string;
}

export interface updateMedia_updateMedia {
  __typename: "UpdateResponse";
  ok: boolean;
  errors: (updateMedia_updateMedia_errors | null)[] | null;
}

export interface updateMedia {
  updateMedia: updateMedia_updateMedia | null;
}

export interface updateMediaVariables {
  id: number;
  name?: string | null;
  description?: string | null;
}
