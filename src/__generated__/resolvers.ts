import {
  GraphQLResolveInfo,
  GraphQLScalarType,
  GraphQLScalarTypeConfig,
} from "graphql";
import { Context } from "../api/server";
export type Maybe<T> = T | null;
export type RequireFields<T, K extends keyof T> = {
  [X in Exclude<keyof T, K>]?: T[X];
} &
  { [P in K]-?: NonNullable<T[P]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  Date: any;
};

export type AdjacentPosts = {
  __typename?: "AdjacentPosts";
  previous?: Maybe<Post>;
  next?: Maybe<Post>;
};

export type Author = {
  __typename?: "Author";
  id?: Maybe<Scalars["Int"]>;
  email?: Maybe<Scalars["String"]>;
  name: Scalars["String"];
  social?: Maybe<TypeSocial>;
  role?: Maybe<Role>;
  bio?: Maybe<Scalars["String"]>;
  avatar?: Maybe<Scalars["String"]>;
};

export type AuthorResponse = {
  __typename?: "AuthorResponse";
  ok: Scalars["Boolean"];
  errors?: Maybe<Array<Error>>;
  data?: Maybe<Author>;
};

export type CreateAuthorResponse = {
  __typename?: "CreateAuthorResponse";
  ok: Scalars["Boolean"];
  errors?: Maybe<Array<Error>>;
};

export type DeleteResponse = {
  __typename?: "DeleteResponse";
  ok: Scalars["Boolean"];
};

export type EditTaxResponse = {
  __typename?: "EditTaxResponse";
  ok: Scalars["Boolean"];
  id?: Maybe<Scalars["Int"]>;
  errors?: Maybe<Array<Error>>;
};

export enum EnumPermissions {
  ReadOnlyPosts = "READ_ONLY_POSTS",
  ManageAllPosts = "MANAGE_ALL_POSTS",
  ManageUsers = "MANAGE_USERS",
  ManageSettings = "MANAGE_SETTINGS",
  ManageOwnPosts = "MANAGE_OWN_POSTS",
}

export enum EnumRoles {
  Admin = "ADMIN",
  Reviewer = "REVIEWER",
  Author = "AUTHOR",
  Reader = "READER",
}

export type Error = {
  __typename?: "Error";
  path: Scalars["String"];
  message?: Maybe<Scalars["String"]>;
};

export type ForgotPasswordResponse = {
  __typename?: "ForgotPasswordResponse";
  ok: Scalars["Boolean"];
  msg?: Maybe<Scalars["String"]>;
};

export type Image = {
  __typename?: "Image";
  src: Scalars["String"];
  width: Scalars["Int"];
  height: Scalars["Int"];
};

export type InputAuthor = {
  id: Scalars["Int"];
  email?: Maybe<Scalars["String"]>;
  name?: Maybe<Scalars["String"]>;
  bio?: Maybe<Scalars["String"]>;
  social?: Maybe<Social>;
  password?: Maybe<Scalars["String"]>;
  roleId?: Maybe<Scalars["Int"]>;
  avatar?: Maybe<Scalars["String"]>;
};

export type InputCreatePost = {
  title?: Maybe<Scalars["String"]>;
  html?: Maybe<Scalars["String"]>;
  md?: Maybe<Scalars["String"]>;
  authorId?: Maybe<Scalars["Int"]>;
  excerpt?: Maybe<Scalars["String"]>;
  cover_image?: Maybe<InputImage>;
  type?: Maybe<Scalars["String"]>;
  featured?: Maybe<Scalars["Boolean"]>;
  status?: Maybe<PostStatusOptions>;
  slug?: Maybe<Scalars["String"]>;
  tags?: Maybe<Array<Maybe<TaxonomyInputType>>>;
};

export type InputImage = {
  src?: Maybe<Scalars["String"]>;
  width?: Maybe<Scalars["Int"]>;
  height?: Maybe<Scalars["Int"]>;
};

export type InputNavigation = {
  type?: Maybe<NavigationType>;
  slug?: Maybe<Scalars["String"]>;
  original_name?: Maybe<Scalars["String"]>;
  label?: Maybe<Scalars["String"]>;
};

export type InputThemeSettings = {
  name: Scalars["String"];
  type: ThemeSettingsUiInputTypes;
  options?: Maybe<Array<Maybe<Scalars["String"]>>>;
  placeholder?: Maybe<Scalars["String"]>;
  defaultValue?: Maybe<Scalars["String"]>;
  changedValue?: Maybe<Scalars["String"]>;
  selectedValue?: Maybe<Scalars["String"]>;
  label: Scalars["String"];
  helpText?: Maybe<Scalars["String"]>;
};

export type InputUpdatePost = {
  id: Scalars["Int"];
  title?: Maybe<Scalars["String"]>;
  html?: Maybe<Scalars["String"]>;
  md?: Maybe<Scalars["String"]>;
  authorId?: Maybe<Scalars["Int"]>;
  featured?: Maybe<Scalars["Boolean"]>;
  excerpt?: Maybe<Scalars["String"]>;
  cover_image?: Maybe<InputImage>;
  publishedAt?: Maybe<Scalars["Date"]>;
  scheduledAt?: Maybe<Scalars["Date"]>;
  type?: Maybe<Scalars["String"]>;
  status?: Maybe<PostStatusOptions>;
  slug?: Maybe<Scalars["String"]>;
  tags?: Maybe<Array<Maybe<TaxonomyInputType>>>;
};

export type LoginResponse = {
  __typename?: "LoginResponse";
  ok: Scalars["Boolean"];
  token?: Maybe<Scalars["String"]>;
  data?: Maybe<Author>;
  errors?: Maybe<Array<Error>>;
};

export type Media = {
  __typename?: "Media";
  id: Scalars["Int"];
  authorId?: Maybe<Scalars["Int"]>;
  url: Scalars["String"];
  createdAt: Scalars["Date"];
  name?: Maybe<Scalars["String"]>;
  width?: Maybe<Scalars["Int"]>;
  height?: Maybe<Scalars["Int"]>;
  description?: Maybe<Scalars["String"]>;
};

export type MediaFilters = {
  id?: Maybe<Scalars["Int"]>;
  cursor?: Maybe<Scalars["Int"]>;
  limit?: Maybe<Scalars["Int"]>;
  page?: Maybe<Scalars["Int"]>;
  authorId?: Maybe<Scalars["Int"]>;
};

export type MediaNode = {
  __typename?: "MediaNode";
  count: Scalars["Int"];
  rows: Array<Media>;
};

export type Mutation = {
  __typename?: "Mutation";
  register: AuthorResponse;
  login: LoginResponse;
  forgotPassword: ForgotPasswordResponse;
  resetPassword: ForgotPasswordResponse;
  updateAuthor?: Maybe<AuthorResponse>;
  createAuthor: CreateAuthorResponse;
  sendMail?: Maybe<Scalars["Boolean"]>;
  insertMedia?: Maybe<Media>;
  deleteMedia?: Maybe<DeleteResponse>;
  updateMedia?: Maybe<UpdateResponse>;
  createPost: Response;
  updatePost: Response;
  deletePosts: Response;
  updateOptions: Setting;
  updateTaxonomy: EditTaxResponse;
  deleteTaxonomy: EditTaxResponse;
  updateThemes: Scalars["Boolean"];
  insertThemes: Scalars["Boolean"];
};

export type MutationRegisterArgs = {
  password: Scalars["String"];
  email: Scalars["String"];
};

export type MutationLoginArgs = {
  email?: Maybe<Scalars["String"]>;
  password: Scalars["String"];
  remember?: Maybe<Scalars["Boolean"]>;
};

export type MutationForgotPasswordArgs = {
  email: Scalars["String"];
};

export type MutationResetPasswordArgs = {
  password: Scalars["String"];
  token: Scalars["String"];
};

export type MutationUpdateAuthorArgs = {
  author: InputAuthor;
};

export type MutationCreateAuthorArgs = {
  email: Scalars["String"];
  name?: Maybe<Scalars["String"]>;
  roleName?: Maybe<EnumRoles>;
};

export type MutationSendMailArgs = {
  to: Scalars["String"];
  subject?: Maybe<Scalars["String"]>;
  body?: Maybe<Scalars["String"]>;
};

export type MutationInsertMediaArgs = {
  url?: Maybe<Scalars["String"]>;
};

export type MutationDeleteMediaArgs = {
  ids: Array<Scalars["Int"]>;
};

export type MutationUpdateMediaArgs = {
  id: Scalars["Int"];
  name?: Maybe<Scalars["String"]>;
  description?: Maybe<Scalars["String"]>;
};

export type MutationCreatePostArgs = {
  data?: Maybe<InputCreatePost>;
};

export type MutationUpdatePostArgs = {
  data?: Maybe<InputUpdatePost>;
};

export type MutationDeletePostsArgs = {
  ids?: Maybe<Array<Scalars["Int"]>>;
  deleteFromSystem?: Maybe<Scalars["Boolean"]>;
};

export type MutationUpdateOptionsArgs = {
  options: Array<OptionInputType>;
};

export type MutationUpdateTaxonomyArgs = {
  id: Scalars["Int"];
  name?: Maybe<Scalars["String"]>;
  desc?: Maybe<Scalars["String"]>;
  type: TaxonomyType;
  slug?: Maybe<Scalars["String"]>;
};

export type MutationDeleteTaxonomyArgs = {
  id: Scalars["Int"];
};

export type MutationUpdateThemesArgs = {
  name: Scalars["String"];
  settings: Array<InputThemeSettings>;
};

export type MutationInsertThemesArgs = {
  name: Scalars["String"];
  settings: Array<InputThemeSettings>;
};

export type Navigation = {
  __typename?: "Navigation";
  type: NavigationType;
  slug: Scalars["String"];
  original_name: Scalars["String"];
  label: Scalars["String"];
};

export enum NavigationType {
  Tag = "tag",
  Page = "page",
  Custom = "custom",
}

export type OptionInputType = {
  site_title?: Maybe<Scalars["String"]>;
  site_tagline?: Maybe<Scalars["String"]>;
  site_email?: Maybe<Scalars["String"]>;
  site_url?: Maybe<Scalars["String"]>;
  site_footer?: Maybe<Scalars["String"]>;
  site_description?: Maybe<Scalars["String"]>;
  subscribe_embed?: Maybe<Scalars["String"]>;
  social_twitter?: Maybe<Scalars["String"]>;
  social_facebook?: Maybe<Scalars["String"]>;
  social_instagram?: Maybe<Scalars["String"]>;
  social_github?: Maybe<Scalars["String"]>;
  displayAuthorInfo?: Maybe<Scalars["String"]>;
  cloudinary_key?: Maybe<Scalars["String"]>;
  cloudinary_name?: Maybe<Scalars["String"]>;
  cloudinary_secret?: Maybe<Scalars["String"]>;
  menu?: Maybe<Array<InputNavigation>>;
  css?: Maybe<Scalars["String"]>;
  google_analytics?: Maybe<Scalars["String"]>;
  locale?: Maybe<Scalars["String"]>;
  theme?: Maybe<Scalars["String"]>;
  disqus_id?: Maybe<Scalars["String"]>;
  banner?: Maybe<InputImage>;
  site_logo?: Maybe<InputImage>;
  site_favicon?: Maybe<InputImage>;
};

export type Permission = {
  __typename?: "Permission";
  id: Scalars["Int"];
  name: Scalars["String"];
};

export type Post = {
  __typename?: "Post";
  /** Primary key */
  id: Scalars["Int"];
  /** Title of the post */
  title: Scalars["String"];
  /** Html content of the post */
  html: Scalars["String"];
  /** Markdown content of the post */
  md: Scalars["String"];
  /** Draft for republishing content */
  md_draft: Scalars["String"];
  /** Author information of the post */
  author: Author;
  /** A breif summary of the post */
  excerpt: Scalars["String"];
  /** Convert image of the post */
  cover_image: Image;
  /** Type of the post. Can be "page" or "post" */
  type: PostTypes;
  /** Status of the post */
  status: PostStatusOptions;
  /** Featured post */
  featured: Scalars["Boolean"];
  /** The uri of the post */
  slug: Scalars["String"];
  /** The creation date of the post */
  createdAt: Scalars["Date"];
  /** The published date of the post */
  publishedAt: Scalars["Date"];
  /** The date scheduled to publish the post */
  scheduledAt?: Maybe<Scalars["Date"]>;
  /** Last updated date of the post */
  updatedAt: Scalars["Date"];
  /** Reading time of the post in minutes */
  reading_time: Scalars["String"];
  /** Tags of the post */
  tags: Array<Taxonomy>;
};

export type PostFilters = {
  id?: Maybe<Scalars["Int"]>;
  slug?: Maybe<Scalars["String"]>;
  featured?: Maybe<Scalars["Boolean"]>;
  previewHash?: Maybe<Scalars["String"]>;
};

export type PostsFilters = {
  tag?: Maybe<Scalars["String"]>;
  tagSlug?: Maybe<Scalars["String"]>;
  sortBy?: Maybe<PostSortBy>;
  status?: Maybe<PostStatusOptions>;
  author?: Maybe<Scalars["String"]>;
  query?: Maybe<Scalars["String"]>;
  type?: Maybe<PostTypes>;
  cursor?: Maybe<Scalars["Int"]>;
  limit?: Maybe<Scalars["Int"]>;
  page?: Maybe<Scalars["Int"]>;
  featured?: Maybe<Scalars["Boolean"]>;
};

export type PostsNode = {
  __typename?: "PostsNode";
  count: Scalars["Int"];
  rows: Array<Post>;
};

export enum PostSortBy {
  Newest = "newest",
  Oldest = "oldest",
}

export type PostStatus = {
  __typename?: "PostStatus";
  published?: Maybe<Scalars["Int"]>;
  drafts?: Maybe<Scalars["Int"]>;
};

export enum PostStatusOptions {
  Publish = "publish",
  Draft = "draft",
  Trash = "trash",
}

export type PostTaxonomyNode = {
  __typename?: "PostTaxonomyNode";
  count?: Maybe<Scalars["Int"]>;
  rows?: Maybe<Array<Maybe<Post>>>;
};

export enum PostTypes {
  Page = "page",
  Post = "post",
}

export type Query = {
  __typename?: "Query";
  author: Author;
  authors: Array<Author>;
  me?: Maybe<Author>;
  validateToken?: Maybe<CreateAuthorResponse>;
  media: MediaNode;
  /** Used to query a single post */
  post?: Maybe<Post>;
  /** Used to query a collection of posts */
  posts: PostsNode;
  adjacentPosts?: Maybe<AdjacentPosts>;
  search?: Maybe<SearchOutput>;
  stats?: Maybe<Stats>;
  roles: Array<Role>;
  globalSearch?: Maybe<SearchResponse>;
  settings: Setting;
  taxonomies: Array<Taxonomy>;
  themes: Array<Theme>;
};

export type QueryAuthorArgs = {
  id: Scalars["Int"];
  email?: Maybe<Scalars["String"]>;
};

export type QueryMediaArgs = {
  filters?: Maybe<MediaFilters>;
};

export type QueryPostArgs = {
  filters?: Maybe<PostFilters>;
};

export type QueryPostsArgs = {
  filters?: Maybe<PostsFilters>;
};

export type QueryAdjacentPostsArgs = {
  slug?: Maybe<Scalars["String"]>;
};

export type QuerySearchArgs = {
  filters: SearchFilters;
};

export type QueryGlobalSearchArgs = {
  keyword?: Maybe<Scalars["String"]>;
};

export type QuerySettingsArgs = {
  option?: Maybe<Scalars["String"]>;
};

export type QueryTaxonomiesArgs = {
  filters?: Maybe<TaxonomyFilters>;
};

export type QueryThemesArgs = {
  name?: Maybe<Scalars["String"]>;
};

export type Response = {
  __typename?: "Response";
  ok: Scalars["Boolean"];
  post?: Maybe<Post>;
  errors?: Maybe<Array<Error>>;
};

export type Role = {
  __typename?: "Role";
  id?: Maybe<Scalars["Int"]>;
  name?: Maybe<EnumRoles>;
  permissions?: Maybe<Array<Maybe<Permission>>>;
};

export type SearchData = {
  __typename?: "SearchData";
  pages?: Maybe<Array<Maybe<SearchResults>>>;
  posts?: Maybe<Array<Maybe<SearchResults>>>;
  tags?: Maybe<Array<Maybe<SearchResults>>>;
};

export type SearchFilters = {
  query?: Maybe<Scalars["String"]>;
  tag?: Maybe<Scalars["String"]>;
  cursor?: Maybe<Scalars["Int"]>;
  featured?: Maybe<Scalars["Boolean"]>;
  page?: Maybe<Scalars["Int"]>;
  limit?: Maybe<Scalars["String"]>;
};

export type SearchOutput = {
  __typename?: "SearchOutput";
  ok?: Maybe<Scalars["Boolean"]>;
  count?: Maybe<Scalars["Int"]>;
  rows?: Maybe<Array<Maybe<SearchResult>>>;
};

export type SearchResponse = {
  __typename?: "SearchResponse";
  ok: Scalars["Boolean"];
  data?: Maybe<SearchData>;
  errors?: Maybe<Array<Error>>;
};

export type SearchResult = {
  __typename?: "SearchResult";
  id?: Maybe<Scalars["Int"]>;
  title?: Maybe<Scalars["String"]>;
  excerpt?: Maybe<Scalars["String"]>;
  publishedAt?: Maybe<Scalars["Date"]>;
  slug?: Maybe<Scalars["String"]>;
  featured?: Maybe<Scalars["Boolean"]>;
};

export type SearchResults = {
  __typename?: "SearchResults";
  title?: Maybe<Scalars["String"]>;
  id?: Maybe<Scalars["Int"]>;
  type?: Maybe<Scalars["String"]>;
};

export type Setting = {
  __typename?: "Setting";
  site_title: Scalars["String"];
  site_tagline: Scalars["String"];
  site_email: Scalars["String"];
  site_url: Scalars["String"];
  site_footer: Scalars["String"];
  site_description: Scalars["String"];
  subscribe_embed: Scalars["String"];
  social_twitter: Scalars["String"];
  social_facebook: Scalars["String"];
  social_instagram: Scalars["String"];
  social_github: Scalars["String"];
  displayAuthorInfo: Scalars["String"];
  cloudinary_key: Scalars["String"];
  cloudinary_name: Scalars["String"];
  cloudinary_secret: Scalars["String"];
  menu: Array<Navigation>;
  css: Scalars["String"];
  google_analytics: Scalars["String"];
  locale: Scalars["String"];
  theme: Scalars["String"];
  disqus_id?: Maybe<Scalars["String"]>;
  banner: Image;
  site_logo: Image;
  site_favicon: Image;
};

export type Social = {
  github?: Maybe<Scalars["String"]>;
  facebook?: Maybe<Scalars["String"]>;
  twitter?: Maybe<Scalars["String"]>;
  instagram?: Maybe<Scalars["String"]>;
};

export type Stats = {
  __typename?: "Stats";
  posts?: Maybe<PostStatus>;
  pages?: Maybe<PostStatus>;
  tags?: Maybe<Scalars["Int"]>;
  media?: Maybe<Scalars["Int"]>;
};

export type Taxonomy = {
  __typename?: "Taxonomy";
  id: Scalars["Int"];
  name: Scalars["String"];
  desc?: Maybe<Scalars["String"]>;
  slug: Scalars["String"];
  type?: Maybe<TaxonomyType>;
  posts?: Maybe<PostsNode>;
};

export type TaxonomyFilters = {
  type?: Maybe<TaxonomyType>;
  active?: Maybe<Scalars["Boolean"]>;
  name?: Maybe<Scalars["String"]>;
};

export type TaxonomyInputType = {
  id?: Maybe<Scalars["Int"]>;
  name?: Maybe<Scalars["String"]>;
  slug?: Maybe<Scalars["String"]>;
};

export enum TaxonomyType {
  PostTag = "post_tag",
}

export enum TaxonomyTypes {
  Tags = "tags",
}

export type Theme = {
  __typename?: "Theme";
  name: Scalars["String"];
  settings: Array<ThemeSettings>;
};

export type ThemeSettings = {
  __typename?: "ThemeSettings";
  name: Scalars["String"];
  type: ThemeSettingsUiInputTypes;
  options?: Maybe<Array<Maybe<Scalars["String"]>>>;
  placeholder?: Maybe<Scalars["String"]>;
  defaultValue?: Maybe<Scalars["String"]>;
  changedValue?: Maybe<Scalars["String"]>;
  selectedValue?: Maybe<Scalars["String"]>;
  label: Scalars["String"];
  helpText?: Maybe<Scalars["String"]>;
};

export enum ThemeSettingsUiInputTypes {
  Radio = "radio",
  Text = "text",
  Checkbox = "checkbox",
  Select = "select",
}

export type TypeSocial = {
  __typename?: "TypeSocial";
  github?: Maybe<Scalars["String"]>;
  facebook?: Maybe<Scalars["String"]>;
  twitter?: Maybe<Scalars["String"]>;
  instagram?: Maybe<Scalars["String"]>;
};

export type UpdateResponse = {
  __typename?: "UpdateResponse";
  ok: Scalars["Boolean"];
  errors?: Maybe<Array<Maybe<Error>>>;
};

export type ResolverTypeWrapper<T> = Promise<T> | T;

export type StitchingResolver<TResult, TParent, TContext, TArgs> = {
  fragment: string;
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};

export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> =
  | ResolverFn<TResult, TParent, TContext, TArgs>
  | StitchingResolver<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo,
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo,
) => AsyncIterator<TResult> | Promise<AsyncIterator<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo,
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<
  TResult,
  TKey extends string,
  TParent,
  TContext,
  TArgs
> {
  subscribe: SubscriptionSubscribeFn<
    { [key in TKey]: TResult },
    TParent,
    TContext,
    TArgs
  >;
  resolve?: SubscriptionResolveFn<
    TResult,
    { [key in TKey]: TResult },
    TContext,
    TArgs
  >;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<
  TResult,
  TKey extends string,
  TParent,
  TContext,
  TArgs
> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<
  TResult,
  TKey extends string,
  TParent = {},
  TContext = {},
  TArgs = {}
> =
  | ((
      ...args: any[]
    ) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo,
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type isTypeOfResolverFn<T = {}> = (
  obj: T,
  info: GraphQLResolveInfo,
) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<
  TResult = {},
  TParent = {},
  TContext = {},
  TArgs = {}
> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo,
) => TResult | Promise<TResult>;

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = {
  Query: ResolverTypeWrapper<Context>;
  Int: ResolverTypeWrapper<Scalars["Int"]>;
  String: ResolverTypeWrapper<Scalars["String"]>;
  Author: ResolverTypeWrapper<Author>;
  TypeSocial: ResolverTypeWrapper<TypeSocial>;
  Role: ResolverTypeWrapper<Role>;
  EnumRoles: EnumRoles;
  Permission: ResolverTypeWrapper<Permission>;
  CreateAuthorResponse: ResolverTypeWrapper<CreateAuthorResponse>;
  Boolean: ResolverTypeWrapper<Scalars["Boolean"]>;
  Error: ResolverTypeWrapper<Error>;
  MediaFilters: MediaFilters;
  MediaNode: ResolverTypeWrapper<MediaNode>;
  Media: ResolverTypeWrapper<Media>;
  Date: ResolverTypeWrapper<Scalars["Date"]>;
  PostFilters: PostFilters;
  Post: ResolverTypeWrapper<Post>;
  Image: ResolverTypeWrapper<Image>;
  PostTypes: PostTypes;
  PostStatusOptions: PostStatusOptions;
  Taxonomy: ResolverTypeWrapper<Taxonomy>;
  TaxonomyType: TaxonomyType;
  PostsNode: ResolverTypeWrapper<PostsNode>;
  PostsFilters: PostsFilters;
  PostSortBy: PostSortBy;
  AdjacentPosts: ResolverTypeWrapper<AdjacentPosts>;
  SearchFilters: SearchFilters;
  SearchOutput: ResolverTypeWrapper<SearchOutput>;
  SearchResult: ResolverTypeWrapper<SearchResult>;
  Stats: ResolverTypeWrapper<Stats>;
  PostStatus: ResolverTypeWrapper<PostStatus>;
  SearchResponse: ResolverTypeWrapper<SearchResponse>;
  SearchData: ResolverTypeWrapper<SearchData>;
  SearchResults: ResolverTypeWrapper<SearchResults>;
  Setting: ResolverTypeWrapper<Setting>;
  Navigation: ResolverTypeWrapper<Navigation>;
  NavigationType: NavigationType;
  TaxonomyFilters: TaxonomyFilters;
  Theme: ResolverTypeWrapper<Theme>;
  ThemeSettings: ResolverTypeWrapper<ThemeSettings>;
  ThemeSettingsUIInputTypes: ThemeSettingsUiInputTypes;
  Mutation: ResolverTypeWrapper<Context>;
  AuthorResponse: ResolverTypeWrapper<AuthorResponse>;
  LoginResponse: ResolverTypeWrapper<LoginResponse>;
  ForgotPasswordResponse: ResolverTypeWrapper<ForgotPasswordResponse>;
  InputAuthor: InputAuthor;
  Social: Social;
  DeleteResponse: ResolverTypeWrapper<DeleteResponse>;
  UpdateResponse: ResolverTypeWrapper<UpdateResponse>;
  InputCreatePost: InputCreatePost;
  InputImage: InputImage;
  TaxonomyInputType: TaxonomyInputType;
  Response: ResolverTypeWrapper<Response>;
  InputUpdatePost: InputUpdatePost;
  OptionInputType: OptionInputType;
  InputNavigation: InputNavigation;
  EditTaxResponse: ResolverTypeWrapper<EditTaxResponse>;
  InputThemeSettings: InputThemeSettings;
  PostTaxonomyNode: ResolverTypeWrapper<PostTaxonomyNode>;
  EnumPermissions: EnumPermissions;
  TaxonomyTypes: TaxonomyTypes;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  Query: Context;
  Int: Scalars["Int"];
  String: Scalars["String"];
  Author: Author;
  TypeSocial: TypeSocial;
  Role: Role;
  EnumRoles: EnumRoles;
  Permission: Permission;
  CreateAuthorResponse: CreateAuthorResponse;
  Boolean: Scalars["Boolean"];
  Error: Error;
  MediaFilters: MediaFilters;
  MediaNode: MediaNode;
  Media: Media;
  Date: Scalars["Date"];
  PostFilters: PostFilters;
  Post: Post;
  Image: Image;
  PostTypes: PostTypes;
  PostStatusOptions: PostStatusOptions;
  Taxonomy: Taxonomy;
  TaxonomyType: TaxonomyType;
  PostsNode: PostsNode;
  PostsFilters: PostsFilters;
  PostSortBy: PostSortBy;
  AdjacentPosts: AdjacentPosts;
  SearchFilters: SearchFilters;
  SearchOutput: SearchOutput;
  SearchResult: SearchResult;
  Stats: Stats;
  PostStatus: PostStatus;
  SearchResponse: SearchResponse;
  SearchData: SearchData;
  SearchResults: SearchResults;
  Setting: Setting;
  Navigation: Navigation;
  NavigationType: NavigationType;
  TaxonomyFilters: TaxonomyFilters;
  Theme: Theme;
  ThemeSettings: ThemeSettings;
  ThemeSettingsUIInputTypes: ThemeSettingsUiInputTypes;
  Mutation: Context;
  AuthorResponse: AuthorResponse;
  LoginResponse: LoginResponse;
  ForgotPasswordResponse: ForgotPasswordResponse;
  InputAuthor: InputAuthor;
  Social: Social;
  DeleteResponse: DeleteResponse;
  UpdateResponse: UpdateResponse;
  InputCreatePost: InputCreatePost;
  InputImage: InputImage;
  TaxonomyInputType: TaxonomyInputType;
  Response: Response;
  InputUpdatePost: InputUpdatePost;
  OptionInputType: OptionInputType;
  InputNavigation: InputNavigation;
  EditTaxResponse: EditTaxResponse;
  InputThemeSettings: InputThemeSettings;
  PostTaxonomyNode: PostTaxonomyNode;
  EnumPermissions: EnumPermissions;
  TaxonomyTypes: TaxonomyTypes;
};

export type AdjacentPostsResolvers<
  ContextType = Context,
  ParentType extends ResolversParentTypes["AdjacentPosts"] = ResolversParentTypes["AdjacentPosts"]
> = {
  previous?: Resolver<Maybe<ResolversTypes["Post"]>, ParentType, ContextType>;
  next?: Resolver<Maybe<ResolversTypes["Post"]>, ParentType, ContextType>;
  __isTypeOf?: isTypeOfResolverFn<ParentType>;
};

export type AuthorResolvers<
  ContextType = Context,
  ParentType extends ResolversParentTypes["Author"] = ResolversParentTypes["Author"]
> = {
  id?: Resolver<Maybe<ResolversTypes["Int"]>, ParentType, ContextType>;
  email?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
  name?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  social?: Resolver<
    Maybe<ResolversTypes["TypeSocial"]>,
    ParentType,
    ContextType
  >;
  role?: Resolver<Maybe<ResolversTypes["Role"]>, ParentType, ContextType>;
  bio?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
  avatar?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
  __isTypeOf?: isTypeOfResolverFn<ParentType>;
};

export type AuthorResponseResolvers<
  ContextType = Context,
  ParentType extends ResolversParentTypes["AuthorResponse"] = ResolversParentTypes["AuthorResponse"]
> = {
  ok?: Resolver<ResolversTypes["Boolean"], ParentType, ContextType>;
  errors?: Resolver<
    Maybe<Array<ResolversTypes["Error"]>>,
    ParentType,
    ContextType
  >;
  data?: Resolver<Maybe<ResolversTypes["Author"]>, ParentType, ContextType>;
  __isTypeOf?: isTypeOfResolverFn<ParentType>;
};

export type CreateAuthorResponseResolvers<
  ContextType = Context,
  ParentType extends ResolversParentTypes["CreateAuthorResponse"] = ResolversParentTypes["CreateAuthorResponse"]
> = {
  ok?: Resolver<ResolversTypes["Boolean"], ParentType, ContextType>;
  errors?: Resolver<
    Maybe<Array<ResolversTypes["Error"]>>,
    ParentType,
    ContextType
  >;
  __isTypeOf?: isTypeOfResolverFn<ParentType>;
};

export interface DateScalarConfig
  extends GraphQLScalarTypeConfig<ResolversTypes["Date"], any> {
  name: "Date";
}

export type DeleteResponseResolvers<
  ContextType = Context,
  ParentType extends ResolversParentTypes["DeleteResponse"] = ResolversParentTypes["DeleteResponse"]
> = {
  ok?: Resolver<ResolversTypes["Boolean"], ParentType, ContextType>;
  __isTypeOf?: isTypeOfResolverFn<ParentType>;
};

export type EditTaxResponseResolvers<
  ContextType = Context,
  ParentType extends ResolversParentTypes["EditTaxResponse"] = ResolversParentTypes["EditTaxResponse"]
> = {
  ok?: Resolver<ResolversTypes["Boolean"], ParentType, ContextType>;
  id?: Resolver<Maybe<ResolversTypes["Int"]>, ParentType, ContextType>;
  errors?: Resolver<
    Maybe<Array<ResolversTypes["Error"]>>,
    ParentType,
    ContextType
  >;
  __isTypeOf?: isTypeOfResolverFn<ParentType>;
};

export type ErrorResolvers<
  ContextType = Context,
  ParentType extends ResolversParentTypes["Error"] = ResolversParentTypes["Error"]
> = {
  path?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  message?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
  __isTypeOf?: isTypeOfResolverFn<ParentType>;
};

export type ForgotPasswordResponseResolvers<
  ContextType = Context,
  ParentType extends ResolversParentTypes["ForgotPasswordResponse"] = ResolversParentTypes["ForgotPasswordResponse"]
> = {
  ok?: Resolver<ResolversTypes["Boolean"], ParentType, ContextType>;
  msg?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
  __isTypeOf?: isTypeOfResolverFn<ParentType>;
};

export type ImageResolvers<
  ContextType = Context,
  ParentType extends ResolversParentTypes["Image"] = ResolversParentTypes["Image"]
> = {
  src?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  width?: Resolver<ResolversTypes["Int"], ParentType, ContextType>;
  height?: Resolver<ResolversTypes["Int"], ParentType, ContextType>;
  __isTypeOf?: isTypeOfResolverFn<ParentType>;
};

export type LoginResponseResolvers<
  ContextType = Context,
  ParentType extends ResolversParentTypes["LoginResponse"] = ResolversParentTypes["LoginResponse"]
> = {
  ok?: Resolver<ResolversTypes["Boolean"], ParentType, ContextType>;
  token?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
  data?: Resolver<Maybe<ResolversTypes["Author"]>, ParentType, ContextType>;
  errors?: Resolver<
    Maybe<Array<ResolversTypes["Error"]>>,
    ParentType,
    ContextType
  >;
  __isTypeOf?: isTypeOfResolverFn<ParentType>;
};

export type MediaResolvers<
  ContextType = Context,
  ParentType extends ResolversParentTypes["Media"] = ResolversParentTypes["Media"]
> = {
  id?: Resolver<ResolversTypes["Int"], ParentType, ContextType>;
  authorId?: Resolver<Maybe<ResolversTypes["Int"]>, ParentType, ContextType>;
  url?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes["Date"], ParentType, ContextType>;
  name?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
  width?: Resolver<Maybe<ResolversTypes["Int"]>, ParentType, ContextType>;
  height?: Resolver<Maybe<ResolversTypes["Int"]>, ParentType, ContextType>;
  description?: Resolver<
    Maybe<ResolversTypes["String"]>,
    ParentType,
    ContextType
  >;
  __isTypeOf?: isTypeOfResolverFn<ParentType>;
};

export type MediaNodeResolvers<
  ContextType = Context,
  ParentType extends ResolversParentTypes["MediaNode"] = ResolversParentTypes["MediaNode"]
> = {
  count?: Resolver<ResolversTypes["Int"], ParentType, ContextType>;
  rows?: Resolver<Array<ResolversTypes["Media"]>, ParentType, ContextType>;
  __isTypeOf?: isTypeOfResolverFn<ParentType>;
};

export type MutationResolvers<
  ContextType = Context,
  ParentType extends ResolversParentTypes["Mutation"] = ResolversParentTypes["Mutation"]
> = {
  register?: Resolver<
    ResolversTypes["AuthorResponse"],
    ParentType,
    ContextType,
    RequireFields<MutationRegisterArgs, "password" | "email">
  >;
  login?: Resolver<
    ResolversTypes["LoginResponse"],
    ParentType,
    ContextType,
    RequireFields<MutationLoginArgs, "password">
  >;
  forgotPassword?: Resolver<
    ResolversTypes["ForgotPasswordResponse"],
    ParentType,
    ContextType,
    RequireFields<MutationForgotPasswordArgs, "email">
  >;
  resetPassword?: Resolver<
    ResolversTypes["ForgotPasswordResponse"],
    ParentType,
    ContextType,
    RequireFields<MutationResetPasswordArgs, "password" | "token">
  >;
  updateAuthor?: Resolver<
    Maybe<ResolversTypes["AuthorResponse"]>,
    ParentType,
    ContextType,
    RequireFields<MutationUpdateAuthorArgs, "author">
  >;
  createAuthor?: Resolver<
    ResolversTypes["CreateAuthorResponse"],
    ParentType,
    ContextType,
    RequireFields<MutationCreateAuthorArgs, "email">
  >;
  sendMail?: Resolver<
    Maybe<ResolversTypes["Boolean"]>,
    ParentType,
    ContextType,
    RequireFields<MutationSendMailArgs, "to">
  >;
  insertMedia?: Resolver<
    Maybe<ResolversTypes["Media"]>,
    ParentType,
    ContextType,
    RequireFields<MutationInsertMediaArgs, never>
  >;
  deleteMedia?: Resolver<
    Maybe<ResolversTypes["DeleteResponse"]>,
    ParentType,
    ContextType,
    RequireFields<MutationDeleteMediaArgs, "ids">
  >;
  updateMedia?: Resolver<
    Maybe<ResolversTypes["UpdateResponse"]>,
    ParentType,
    ContextType,
    RequireFields<MutationUpdateMediaArgs, "id">
  >;
  createPost?: Resolver<
    ResolversTypes["Response"],
    ParentType,
    ContextType,
    RequireFields<MutationCreatePostArgs, never>
  >;
  updatePost?: Resolver<
    ResolversTypes["Response"],
    ParentType,
    ContextType,
    RequireFields<MutationUpdatePostArgs, never>
  >;
  deletePosts?: Resolver<
    ResolversTypes["Response"],
    ParentType,
    ContextType,
    RequireFields<MutationDeletePostsArgs, never>
  >;
  updateOptions?: Resolver<
    ResolversTypes["Setting"],
    ParentType,
    ContextType,
    RequireFields<MutationUpdateOptionsArgs, "options">
  >;
  updateTaxonomy?: Resolver<
    ResolversTypes["EditTaxResponse"],
    ParentType,
    ContextType,
    RequireFields<MutationUpdateTaxonomyArgs, "id" | "type">
  >;
  deleteTaxonomy?: Resolver<
    ResolversTypes["EditTaxResponse"],
    ParentType,
    ContextType,
    RequireFields<MutationDeleteTaxonomyArgs, "id">
  >;
  updateThemes?: Resolver<
    ResolversTypes["Boolean"],
    ParentType,
    ContextType,
    RequireFields<MutationUpdateThemesArgs, "name" | "settings">
  >;
  insertThemes?: Resolver<
    ResolversTypes["Boolean"],
    ParentType,
    ContextType,
    RequireFields<MutationInsertThemesArgs, "name" | "settings">
  >;
};

export type NavigationResolvers<
  ContextType = Context,
  ParentType extends ResolversParentTypes["Navigation"] = ResolversParentTypes["Navigation"]
> = {
  type?: Resolver<ResolversTypes["NavigationType"], ParentType, ContextType>;
  slug?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  original_name?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  label?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  __isTypeOf?: isTypeOfResolverFn<ParentType>;
};

export type PermissionResolvers<
  ContextType = Context,
  ParentType extends ResolversParentTypes["Permission"] = ResolversParentTypes["Permission"]
> = {
  id?: Resolver<ResolversTypes["Int"], ParentType, ContextType>;
  name?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  __isTypeOf?: isTypeOfResolverFn<ParentType>;
};

export type PostResolvers<
  ContextType = Context,
  ParentType extends ResolversParentTypes["Post"] = ResolversParentTypes["Post"]
> = {
  id?: Resolver<ResolversTypes["Int"], ParentType, ContextType>;
  title?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  html?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  md?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  md_draft?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  author?: Resolver<ResolversTypes["Author"], ParentType, ContextType>;
  excerpt?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  cover_image?: Resolver<ResolversTypes["Image"], ParentType, ContextType>;
  type?: Resolver<ResolversTypes["PostTypes"], ParentType, ContextType>;
  status?: Resolver<
    ResolversTypes["PostStatusOptions"],
    ParentType,
    ContextType
  >;
  featured?: Resolver<ResolversTypes["Boolean"], ParentType, ContextType>;
  slug?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes["Date"], ParentType, ContextType>;
  publishedAt?: Resolver<ResolversTypes["Date"], ParentType, ContextType>;
  scheduledAt?: Resolver<
    Maybe<ResolversTypes["Date"]>,
    ParentType,
    ContextType
  >;
  updatedAt?: Resolver<ResolversTypes["Date"], ParentType, ContextType>;
  reading_time?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  tags?: Resolver<Array<ResolversTypes["Taxonomy"]>, ParentType, ContextType>;
  __isTypeOf?: isTypeOfResolverFn<ParentType>;
};

export type PostsNodeResolvers<
  ContextType = Context,
  ParentType extends ResolversParentTypes["PostsNode"] = ResolversParentTypes["PostsNode"]
> = {
  count?: Resolver<ResolversTypes["Int"], ParentType, ContextType>;
  rows?: Resolver<Array<ResolversTypes["Post"]>, ParentType, ContextType>;
  __isTypeOf?: isTypeOfResolverFn<ParentType>;
};

export type PostStatusResolvers<
  ContextType = Context,
  ParentType extends ResolversParentTypes["PostStatus"] = ResolversParentTypes["PostStatus"]
> = {
  published?: Resolver<Maybe<ResolversTypes["Int"]>, ParentType, ContextType>;
  drafts?: Resolver<Maybe<ResolversTypes["Int"]>, ParentType, ContextType>;
  __isTypeOf?: isTypeOfResolverFn<ParentType>;
};

export type PostTaxonomyNodeResolvers<
  ContextType = Context,
  ParentType extends ResolversParentTypes["PostTaxonomyNode"] = ResolversParentTypes["PostTaxonomyNode"]
> = {
  count?: Resolver<Maybe<ResolversTypes["Int"]>, ParentType, ContextType>;
  rows?: Resolver<
    Maybe<Array<Maybe<ResolversTypes["Post"]>>>,
    ParentType,
    ContextType
  >;
  __isTypeOf?: isTypeOfResolverFn<ParentType>;
};

export type QueryResolvers<
  ContextType = Context,
  ParentType extends ResolversParentTypes["Query"] = ResolversParentTypes["Query"]
> = {
  author?: Resolver<
    ResolversTypes["Author"],
    ParentType,
    ContextType,
    RequireFields<QueryAuthorArgs, "id">
  >;
  authors?: Resolver<Array<ResolversTypes["Author"]>, ParentType, ContextType>;
  me?: Resolver<Maybe<ResolversTypes["Author"]>, ParentType, ContextType>;
  validateToken?: Resolver<
    Maybe<ResolversTypes["CreateAuthorResponse"]>,
    ParentType,
    ContextType
  >;
  media?: Resolver<
    ResolversTypes["MediaNode"],
    ParentType,
    ContextType,
    RequireFields<QueryMediaArgs, never>
  >;
  post?: Resolver<
    Maybe<ResolversTypes["Post"]>,
    ParentType,
    ContextType,
    RequireFields<QueryPostArgs, never>
  >;
  posts?: Resolver<
    ResolversTypes["PostsNode"],
    ParentType,
    ContextType,
    RequireFields<QueryPostsArgs, never>
  >;
  adjacentPosts?: Resolver<
    Maybe<ResolversTypes["AdjacentPosts"]>,
    ParentType,
    ContextType,
    RequireFields<QueryAdjacentPostsArgs, never>
  >;
  search?: Resolver<
    Maybe<ResolversTypes["SearchOutput"]>,
    ParentType,
    ContextType,
    RequireFields<QuerySearchArgs, "filters">
  >;
  stats?: Resolver<Maybe<ResolversTypes["Stats"]>, ParentType, ContextType>;
  roles?: Resolver<Array<ResolversTypes["Role"]>, ParentType, ContextType>;
  globalSearch?: Resolver<
    Maybe<ResolversTypes["SearchResponse"]>,
    ParentType,
    ContextType,
    RequireFields<QueryGlobalSearchArgs, never>
  >;
  settings?: Resolver<
    ResolversTypes["Setting"],
    ParentType,
    ContextType,
    RequireFields<QuerySettingsArgs, never>
  >;
  taxonomies?: Resolver<
    Array<ResolversTypes["Taxonomy"]>,
    ParentType,
    ContextType,
    RequireFields<QueryTaxonomiesArgs, never>
  >;
  themes?: Resolver<
    Array<ResolversTypes["Theme"]>,
    ParentType,
    ContextType,
    RequireFields<QueryThemesArgs, never>
  >;
};

export type ResponseResolvers<
  ContextType = Context,
  ParentType extends ResolversParentTypes["Response"] = ResolversParentTypes["Response"]
> = {
  ok?: Resolver<ResolversTypes["Boolean"], ParentType, ContextType>;
  post?: Resolver<Maybe<ResolversTypes["Post"]>, ParentType, ContextType>;
  errors?: Resolver<
    Maybe<Array<ResolversTypes["Error"]>>,
    ParentType,
    ContextType
  >;
  __isTypeOf?: isTypeOfResolverFn<ParentType>;
};

export type RoleResolvers<
  ContextType = Context,
  ParentType extends ResolversParentTypes["Role"] = ResolversParentTypes["Role"]
> = {
  id?: Resolver<Maybe<ResolversTypes["Int"]>, ParentType, ContextType>;
  name?: Resolver<Maybe<ResolversTypes["EnumRoles"]>, ParentType, ContextType>;
  permissions?: Resolver<
    Maybe<Array<Maybe<ResolversTypes["Permission"]>>>,
    ParentType,
    ContextType
  >;
  __isTypeOf?: isTypeOfResolverFn<ParentType>;
};

export type SearchDataResolvers<
  ContextType = Context,
  ParentType extends ResolversParentTypes["SearchData"] = ResolversParentTypes["SearchData"]
> = {
  pages?: Resolver<
    Maybe<Array<Maybe<ResolversTypes["SearchResults"]>>>,
    ParentType,
    ContextType
  >;
  posts?: Resolver<
    Maybe<Array<Maybe<ResolversTypes["SearchResults"]>>>,
    ParentType,
    ContextType
  >;
  tags?: Resolver<
    Maybe<Array<Maybe<ResolversTypes["SearchResults"]>>>,
    ParentType,
    ContextType
  >;
  __isTypeOf?: isTypeOfResolverFn<ParentType>;
};

export type SearchOutputResolvers<
  ContextType = Context,
  ParentType extends ResolversParentTypes["SearchOutput"] = ResolversParentTypes["SearchOutput"]
> = {
  ok?: Resolver<Maybe<ResolversTypes["Boolean"]>, ParentType, ContextType>;
  count?: Resolver<Maybe<ResolversTypes["Int"]>, ParentType, ContextType>;
  rows?: Resolver<
    Maybe<Array<Maybe<ResolversTypes["SearchResult"]>>>,
    ParentType,
    ContextType
  >;
  __isTypeOf?: isTypeOfResolverFn<ParentType>;
};

export type SearchResponseResolvers<
  ContextType = Context,
  ParentType extends ResolversParentTypes["SearchResponse"] = ResolversParentTypes["SearchResponse"]
> = {
  ok?: Resolver<ResolversTypes["Boolean"], ParentType, ContextType>;
  data?: Resolver<Maybe<ResolversTypes["SearchData"]>, ParentType, ContextType>;
  errors?: Resolver<
    Maybe<Array<ResolversTypes["Error"]>>,
    ParentType,
    ContextType
  >;
  __isTypeOf?: isTypeOfResolverFn<ParentType>;
};

export type SearchResultResolvers<
  ContextType = Context,
  ParentType extends ResolversParentTypes["SearchResult"] = ResolversParentTypes["SearchResult"]
> = {
  id?: Resolver<Maybe<ResolversTypes["Int"]>, ParentType, ContextType>;
  title?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
  excerpt?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
  publishedAt?: Resolver<
    Maybe<ResolversTypes["Date"]>,
    ParentType,
    ContextType
  >;
  slug?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
  featured?: Resolver<
    Maybe<ResolversTypes["Boolean"]>,
    ParentType,
    ContextType
  >;
  __isTypeOf?: isTypeOfResolverFn<ParentType>;
};

export type SearchResultsResolvers<
  ContextType = Context,
  ParentType extends ResolversParentTypes["SearchResults"] = ResolversParentTypes["SearchResults"]
> = {
  title?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
  id?: Resolver<Maybe<ResolversTypes["Int"]>, ParentType, ContextType>;
  type?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
  __isTypeOf?: isTypeOfResolverFn<ParentType>;
};

export type SettingResolvers<
  ContextType = Context,
  ParentType extends ResolversParentTypes["Setting"] = ResolversParentTypes["Setting"]
> = {
  site_title?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  site_tagline?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  site_email?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  site_url?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  site_footer?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  site_description?: Resolver<
    ResolversTypes["String"],
    ParentType,
    ContextType
  >;
  subscribe_embed?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  social_twitter?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  social_facebook?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  social_instagram?: Resolver<
    ResolversTypes["String"],
    ParentType,
    ContextType
  >;
  social_github?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  displayAuthorInfo?: Resolver<
    ResolversTypes["String"],
    ParentType,
    ContextType
  >;
  cloudinary_key?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  cloudinary_name?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  cloudinary_secret?: Resolver<
    ResolversTypes["String"],
    ParentType,
    ContextType
  >;
  menu?: Resolver<Array<ResolversTypes["Navigation"]>, ParentType, ContextType>;
  css?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  google_analytics?: Resolver<
    ResolversTypes["String"],
    ParentType,
    ContextType
  >;
  locale?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  theme?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  disqus_id?: Resolver<
    Maybe<ResolversTypes["String"]>,
    ParentType,
    ContextType
  >;
  banner?: Resolver<ResolversTypes["Image"], ParentType, ContextType>;
  site_logo?: Resolver<ResolversTypes["Image"], ParentType, ContextType>;
  site_favicon?: Resolver<ResolversTypes["Image"], ParentType, ContextType>;
  __isTypeOf?: isTypeOfResolverFn<ParentType>;
};

export type StatsResolvers<
  ContextType = Context,
  ParentType extends ResolversParentTypes["Stats"] = ResolversParentTypes["Stats"]
> = {
  posts?: Resolver<
    Maybe<ResolversTypes["PostStatus"]>,
    ParentType,
    ContextType
  >;
  pages?: Resolver<
    Maybe<ResolversTypes["PostStatus"]>,
    ParentType,
    ContextType
  >;
  tags?: Resolver<Maybe<ResolversTypes["Int"]>, ParentType, ContextType>;
  media?: Resolver<Maybe<ResolversTypes["Int"]>, ParentType, ContextType>;
  __isTypeOf?: isTypeOfResolverFn<ParentType>;
};

export type TaxonomyResolvers<
  ContextType = Context,
  ParentType extends ResolversParentTypes["Taxonomy"] = ResolversParentTypes["Taxonomy"]
> = {
  id?: Resolver<ResolversTypes["Int"], ParentType, ContextType>;
  name?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  desc?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
  slug?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  type?: Resolver<
    Maybe<ResolversTypes["TaxonomyType"]>,
    ParentType,
    ContextType
  >;
  posts?: Resolver<Maybe<ResolversTypes["PostsNode"]>, ParentType, ContextType>;
  __isTypeOf?: isTypeOfResolverFn<ParentType>;
};

export type ThemeResolvers<
  ContextType = Context,
  ParentType extends ResolversParentTypes["Theme"] = ResolversParentTypes["Theme"]
> = {
  name?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  settings?: Resolver<
    Array<ResolversTypes["ThemeSettings"]>,
    ParentType,
    ContextType
  >;
  __isTypeOf?: isTypeOfResolverFn<ParentType>;
};

export type ThemeSettingsResolvers<
  ContextType = Context,
  ParentType extends ResolversParentTypes["ThemeSettings"] = ResolversParentTypes["ThemeSettings"]
> = {
  name?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  type?: Resolver<
    ResolversTypes["ThemeSettingsUIInputTypes"],
    ParentType,
    ContextType
  >;
  options?: Resolver<
    Maybe<Array<Maybe<ResolversTypes["String"]>>>,
    ParentType,
    ContextType
  >;
  placeholder?: Resolver<
    Maybe<ResolversTypes["String"]>,
    ParentType,
    ContextType
  >;
  defaultValue?: Resolver<
    Maybe<ResolversTypes["String"]>,
    ParentType,
    ContextType
  >;
  changedValue?: Resolver<
    Maybe<ResolversTypes["String"]>,
    ParentType,
    ContextType
  >;
  selectedValue?: Resolver<
    Maybe<ResolversTypes["String"]>,
    ParentType,
    ContextType
  >;
  label?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  helpText?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
  __isTypeOf?: isTypeOfResolverFn<ParentType>;
};

export type TypeSocialResolvers<
  ContextType = Context,
  ParentType extends ResolversParentTypes["TypeSocial"] = ResolversParentTypes["TypeSocial"]
> = {
  github?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
  facebook?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
  twitter?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
  instagram?: Resolver<
    Maybe<ResolversTypes["String"]>,
    ParentType,
    ContextType
  >;
  __isTypeOf?: isTypeOfResolverFn<ParentType>;
};

export type UpdateResponseResolvers<
  ContextType = Context,
  ParentType extends ResolversParentTypes["UpdateResponse"] = ResolversParentTypes["UpdateResponse"]
> = {
  ok?: Resolver<ResolversTypes["Boolean"], ParentType, ContextType>;
  errors?: Resolver<
    Maybe<Array<Maybe<ResolversTypes["Error"]>>>,
    ParentType,
    ContextType
  >;
  __isTypeOf?: isTypeOfResolverFn<ParentType>;
};

export type Resolvers<ContextType = Context> = {
  AdjacentPosts?: AdjacentPostsResolvers<ContextType>;
  Author?: AuthorResolvers<ContextType>;
  AuthorResponse?: AuthorResponseResolvers<ContextType>;
  CreateAuthorResponse?: CreateAuthorResponseResolvers<ContextType>;
  Date?: GraphQLScalarType;
  DeleteResponse?: DeleteResponseResolvers<ContextType>;
  EditTaxResponse?: EditTaxResponseResolvers<ContextType>;
  Error?: ErrorResolvers<ContextType>;
  ForgotPasswordResponse?: ForgotPasswordResponseResolvers<ContextType>;
  Image?: ImageResolvers<ContextType>;
  LoginResponse?: LoginResponseResolvers<ContextType>;
  Media?: MediaResolvers<ContextType>;
  MediaNode?: MediaNodeResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  Navigation?: NavigationResolvers<ContextType>;
  Permission?: PermissionResolvers<ContextType>;
  Post?: PostResolvers<ContextType>;
  PostsNode?: PostsNodeResolvers<ContextType>;
  PostStatus?: PostStatusResolvers<ContextType>;
  PostTaxonomyNode?: PostTaxonomyNodeResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  Response?: ResponseResolvers<ContextType>;
  Role?: RoleResolvers<ContextType>;
  SearchData?: SearchDataResolvers<ContextType>;
  SearchOutput?: SearchOutputResolvers<ContextType>;
  SearchResponse?: SearchResponseResolvers<ContextType>;
  SearchResult?: SearchResultResolvers<ContextType>;
  SearchResults?: SearchResultsResolvers<ContextType>;
  Setting?: SettingResolvers<ContextType>;
  Stats?: StatsResolvers<ContextType>;
  Taxonomy?: TaxonomyResolvers<ContextType>;
  Theme?: ThemeResolvers<ContextType>;
  ThemeSettings?: ThemeSettingsResolvers<ContextType>;
  TypeSocial?: TypeSocialResolvers<ContextType>;
  UpdateResponse?: UpdateResponseResolvers<ContextType>;
};

/**
 * @deprecated
 * Use "Resolvers" root object instead. If you wish to get "IResolvers", add "typesPrefix: I" to your config.
 */
export type IResolvers<ContextType = Context> = Resolvers<ContextType>;
