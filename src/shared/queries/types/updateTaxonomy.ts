/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: updateTaxonomy
// ====================================================

export interface updateTaxonomy_updateTaxonomy_errors {
  __typename: "Error";
  message: string | null;
  path: string;
}

export interface updateTaxonomy_updateTaxonomy {
  __typename: "EditTaxResponse";
  id: number | null;
  ok: boolean | null;
  errors: updateTaxonomy_updateTaxonomy_errors[] | null;
}

export interface updateTaxonomy {
  updateTaxonomy: updateTaxonomy_updateTaxonomy | null;
}

export interface updateTaxonomyVariables {
  id: number;
  name?: string | null;
  desc?: string | null;
  type: string;
  slug?: string | null;
  edit?: boolean | null;
}
