/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { MenuFiltersWithPagination, TaxonomyTypes } from "./../../../../types/globalTypes";

// ====================================================
// GraphQL query operation: menuContent
// ====================================================

export interface menuContent_menuContent_rows_author {
  __typename: "Author";
  fname: string;
  lname: string;
  avatar: string | null;
  bio: string;
}

export interface menuContent_menuContent_rows_taxonomies {
  __typename: "Taxonomy";
  id: number;
  name: string;
  type: TaxonomyTypes;
  slug: string;
}

export interface menuContent_menuContent_rows {
  __typename: "Post";
  id: number | null;
  title: string | null;
  body: string | null;
  status: string | null;
  createdAt: any | null;
  publishedAt: any | null;
  excerpt: string | null;
  cover_image: string | null;
  slug: string | null;
  mode: string | null;
  type: string | null;
  author: menuContent_menuContent_rows_author | null;
  taxonomies: (menuContent_menuContent_rows_taxonomies | null)[] | null;
}

export interface menuContent_menuContent {
  __typename: "PostTaxonomyNode";
  count: number | null;
  rows: (menuContent_menuContent_rows | null)[] | null;
}

export interface menuContent {
  menuContent: menuContent_menuContent | null;
}

export interface menuContentVariables {
  filters?: MenuFiltersWithPagination | null;
}
