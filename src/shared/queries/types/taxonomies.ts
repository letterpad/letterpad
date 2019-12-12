/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { TaxonomyTypes } from "./../../../../types/globalTypes";

// ====================================================
// GraphQL query operation: taxonomies
// ====================================================

export interface taxonomies_taxonomies {
  __typename: "Taxonomy";
  id: number;
  name: string;
  desc: string | null;
  slug: string;
}

export interface taxonomies {
  taxonomies: taxonomies_taxonomies[];
}

export interface taxonomiesVariables {
  type: TaxonomyTypes;
}
