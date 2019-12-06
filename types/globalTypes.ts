/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

//==============================================================
// START Enums and Input Objects
//==============================================================

export enum MenuTypes {
  category = "category",
  page = "page",
}

export enum PostSortBy {
  newest = "newest",
  oldest = "oldest",
}

export enum PostStatusOptions {
  draft = "draft",
  publish = "publish",
  trash = "trash",
}

export enum PostTypes {
  page = "page",
  post = "post",
}

export interface InputCreatePost {
  title?: string | null;
  body?: string | null;
  authorId?: number | null;
  excerpt?: string | null;
  cover_image?: string | null;
  type?: string | null;
  status?: PostStatusOptions | null;
  slug?: string | null;
  taxonomies?: (TaxonomyInputType | null)[] | null;
}

export interface InputUpdatePost {
  id: number;
  title?: string | null;
  body?: string | null;
  authorId?: number | null;
  excerpt?: string | null;
  cover_image?: string | null;
  type?: string | null;
  status?: PostStatusOptions | null;
  slug?: string | null;
  taxonomies?: (TaxonomyInputType | null)[] | null;
}

export interface MenuFiltersWithPagination {
  slug?: string | null;
  type: MenuTypes;
  page?: number | null;
  limit?: number | null;
}

export interface OptionInputType {
  id?: number | null;
  option?: string | null;
  value?: string | null;
}

export interface PostFiltersWithPagination {
  tag?: string | null;
  category?: string | null;
  authorName?: string | null;
  sortBy?: PostSortBy | null;
  status?: PostStatusOptions | null;
  author?: string | null;
  query?: string | null;
  type?: PostTypes | null;
  cursor?: number | null;
  limit?: number | null;
  page?: number | null;
}

export interface SinglePostFilters {
  id?: number | null;
  slug?: string | null;
}

export interface TaxonomyInputType {
  id?: number | null;
  name?: string | null;
  type?: string | null;
  slug?: string | null;
}

//==============================================================
// END Enums and Input Objects
//==============================================================
