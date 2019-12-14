/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { MediaFiltersWithPagination } from "./../../../../types/globalTypes";

// ====================================================
// GraphQL query operation: media
// ====================================================

export interface media_media_rows {
  __typename: "Media";
  id: number;
  url: string;
  createdAt: any;
  name: string | null;
  description: string | null;
}

export interface media_media {
  __typename: "MediaNode";
  count: number;
  rows: media_media_rows[];
}

export interface media {
  media: media_media;
}

export interface mediaVariables {
  filters?: MediaFiltersWithPagination | null;
}
