/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: getMedia
// ====================================================

export interface getMedia_media_rows {
  __typename: "Media";
  id: number | null;
  url: string | null;
  createdAt: any | null;
  name: string | null;
  description: string | null;
}

export interface getMedia_media {
  __typename: "MediaNode";
  count: number | null;
  rows: (getMedia_media_rows | null)[] | null;
}

export interface getMedia {
  media: getMedia_media;
}

export interface getMediaVariables {
  authorId: number;
  offset?: number | null;
  limit?: number | null;
}
