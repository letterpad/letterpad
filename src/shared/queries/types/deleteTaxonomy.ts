/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: deleteTaxonomy
// ====================================================

export interface deleteTaxonomy_deleteTaxonomy_errors {
  __typename: "Error";
  message: string | null;
  path: string;
}

export interface deleteTaxonomy_deleteTaxonomy {
  __typename: "EditTaxResponse";
  id: number | null;
  ok: boolean | null;
  errors: deleteTaxonomy_deleteTaxonomy_errors[] | null;
}

export interface deleteTaxonomy {
  deleteTaxonomy: deleteTaxonomy_deleteTaxonomy | null;
}

export interface deleteTaxonomyVariables {
  id: number;
}
