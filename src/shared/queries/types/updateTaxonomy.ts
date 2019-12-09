/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { TaxonomyTypes } from "./../../../../types/globalTypes";

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
  ok: boolean;
  errors: updateTaxonomy_updateTaxonomy_errors[] | null;
}

export interface updateTaxonomy {
  updateTaxonomy: updateTaxonomy_updateTaxonomy;
}

export interface updateTaxonomyVariables {
  id: number;
  name?: string | null;
  desc?: string | null;
  type: TaxonomyTypes;
  slug?: string | null;
}
