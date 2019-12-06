/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: getTaxonomies
// ====================================================

export interface getTaxonomies_taxonomies {
  __typename: "Taxonomy";
  id: number | null;
  name: string | null;
  desc: string | null;
  slug: string | null;
}

export interface getTaxonomies {
  taxonomies: (getTaxonomies_taxonomies | null)[] | null;
}

export interface getTaxonomiesVariables {
  type: string;
}
