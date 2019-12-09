/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { TaxonomyTypes } from "./../../../../types/globalTypes";

// ====================================================
// GraphQL query operation: getTaxonomies
// ====================================================

export interface getTaxonomies_taxonomies {
  __typename: "Taxonomy";
  id: number;
  name: string;
  desc: string;
  slug: string;
}

export interface getTaxonomies {
  taxonomies: getTaxonomies_taxonomies[];
}

export interface getTaxonomiesVariables {
  type: TaxonomyTypes;
}
