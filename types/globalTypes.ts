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

export enum SettingOptions {
  banner = "banner",
  css = "css",
  displayAuthorInfo = "displayAuthorInfo",
  disqus_id = "disqus_id",
  google_analytics = "google_analytics",
  locale = "locale",
  menu = "menu",
  site_description = "site_description",
  site_email = "site_email",
  site_footer = "site_footer",
  site_logo = "site_logo",
  site_tagline = "site_tagline",
  site_title = "site_title",
  site_url = "site_url",
  social_facebook = "social_facebook",
  social_github = "social_github",
  social_instagram = "social_instagram",
  social_twitter = "social_twitter",
  text_notfound = "text_notfound",
  text_posts_empty = "text_posts_empty",
  theme = "theme",
}

export enum TaxonomyTypes {
  post_category = "post_category",
  post_tag = "post_tag",
}

export enum ThemeSettingsUIInputTypes {
  checkbox = "checkbox",
  radio = "radio",
  text = "text",
}

export enum ThemeSettingsUITags {
  input = "input",
  select = "select",
}

export interface InputAuthor {
  id: number;
  email?: string | null;
  fname?: string | null;
  lname?: string | null;
  bio?: string | null;
  social?: Social | null;
  password?: string | null;
  roleId?: number | null;
  avatar?: string | null;
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

export interface InputThemeSettings {
  name: string;
  type: ThemeSettingsUIInputTypes;
  tag: ThemeSettingsUITags;
  options?: (string | null)[] | null;
  placeholder?: string | null;
  defaultValue?: string | null;
  changedValue?: string | null;
  selectedValue?: string | null;
  label: string;
  helpText?: string | null;
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
  option?: SettingOptions | null;
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

export interface Social {
  github?: string | null;
  facebook?: string | null;
  twitter?: string | null;
  instagram?: string | null;
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
