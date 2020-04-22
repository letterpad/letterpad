export type Maybe<T> = T | null;
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
  username?: Maybe<Scalars["String"]>;
  email?: Maybe<Scalars["String"]>;
  fname: Scalars["String"];
  lname: Scalars["String"];
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
  fname?: Maybe<Scalars["String"]>;
  lname?: Maybe<Scalars["String"]>;
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
  tag: ThemeSettingsUiTags;
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
  username: Scalars["String"];
  password: Scalars["String"];
  email: Scalars["String"];
};

export type MutationLoginArgs = {
  username?: Maybe<Scalars["String"]>;
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
  fname?: Maybe<Scalars["String"]>;
  lname?: Maybe<Scalars["String"]>;
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
  username?: Maybe<Scalars["String"]>;
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
  tag: ThemeSettingsUiTags;
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
}

export enum ThemeSettingsUiTags {
  Input = "input",
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

export type PostFieldsFragment = { __typename?: "Post" } & Pick<
  Post,
  | "id"
  | "title"
  | "md"
  | "md_draft"
  | "html"
  | "status"
  | "createdAt"
  | "publishedAt"
  | "scheduledAt"
  | "updatedAt"
  | "excerpt"
  | "reading_time"
  | "featured"
  | "slug"
  | "type"
> & {
    cover_image: { __typename?: "Image" } & Pick<
      Image,
      "width" | "height" | "src"
    >;
    author: { __typename?: "Author" } & Pick<
      Author,
      "fname" | "lname" | "avatar" | "bio"
    >;
    tags: Array<
      { __typename?: "Taxonomy" } & Pick<Taxonomy, "id" | "name" | "slug">
    >;
  };

export type CreatePostMutationVariables = {
  data?: Maybe<InputCreatePost>;
};

export type CreatePostMutation = { __typename?: "Mutation" } & {
  createPost: { __typename?: "Response" } & Pick<Response, "ok"> & {
      errors: Maybe<
        Array<{ __typename?: "Error" } & Pick<Error, "path" | "message">>
      >;
      post: Maybe<
        { __typename?: "Post" } & Pick<
          Post,
          | "id"
          | "title"
          | "md"
          | "html"
          | "status"
          | "type"
          | "slug"
          | "excerpt"
          | "featured"
          | "createdAt"
          | "publishedAt"
          | "scheduledAt"
        > & {
            author: { __typename?: "Author" } & Pick<Author, "username">;
            cover_image: { __typename?: "Image" } & Pick<
              Image,
              "src" | "width" | "height"
            >;
            tags: Array<
              { __typename?: "Taxonomy" } & Pick<
                Taxonomy,
                "id" | "name" | "slug"
              >
            >;
          }
      >;
    };
};

export type UpdateOptionsMutationVariables = {
  options: Array<OptionInputType>;
};

export type UpdateOptionsMutation = { __typename?: "Mutation" } & {
  updateOptions: { __typename?: "Setting" } & Pick<
    Setting,
    | "site_title"
    | "site_tagline"
    | "site_email"
    | "site_url"
    | "site_footer"
    | "site_description"
    | "subscribe_embed"
    | "social_twitter"
    | "social_facebook"
    | "social_instagram"
    | "social_github"
    | "displayAuthorInfo"
    | "cloudinary_key"
    | "cloudinary_name"
    | "cloudinary_secret"
    | "css"
    | "google_analytics"
    | "locale"
    | "theme"
    | "disqus_id"
  > & {
      menu: Array<
        { __typename?: "Navigation" } & Pick<
          Navigation,
          "label" | "original_name" | "slug" | "type"
        >
      >;
      banner: { __typename?: "Image" } & Pick<
        Image,
        "src" | "width" | "height"
      >;
      site_logo: { __typename?: "Image" } & Pick<
        Image,
        "src" | "width" | "height"
      >;
      site_favicon: { __typename?: "Image" } & Pick<
        Image,
        "src" | "width" | "height"
      >;
    };
};

export type InsertThemesMutationVariables = {
  name: Scalars["String"];
  settings: Array<InputThemeSettings>;
};

export type InsertThemesMutation = { __typename?: "Mutation" } & Pick<
  Mutation,
  "insertThemes"
>;

export type UpdateThemesMutationVariables = {
  name: Scalars["String"];
  settings: Array<InputThemeSettings>;
};

export type UpdateThemesMutation = { __typename?: "Mutation" } & Pick<
  Mutation,
  "updateThemes"
>;

export type UpdateTaxonomyMutationVariables = {
  id: Scalars["Int"];
  name?: Maybe<Scalars["String"]>;
  desc?: Maybe<Scalars["String"]>;
  type: TaxonomyType;
  slug?: Maybe<Scalars["String"]>;
};

export type UpdateTaxonomyMutation = { __typename?: "Mutation" } & {
  updateTaxonomy: { __typename?: "EditTaxResponse" } & Pick<
    EditTaxResponse,
    "id" | "ok"
  > & {
      errors: Maybe<
        Array<{ __typename?: "Error" } & Pick<Error, "message" | "path">>
      >;
    };
};

export type DeleteTaxonomyMutationVariables = {
  id: Scalars["Int"];
};

export type DeleteTaxonomyMutation = { __typename?: "Mutation" } & {
  deleteTaxonomy: { __typename?: "EditTaxResponse" } & Pick<
    EditTaxResponse,
    "id" | "ok"
  > & {
      errors: Maybe<
        Array<{ __typename?: "Error" } & Pick<Error, "message" | "path">>
      >;
    };
};

export type DeletePostsMutationVariables = {
  ids?: Maybe<Array<Scalars["Int"]>>;
  deleteFromSystem?: Maybe<Scalars["Boolean"]>;
};

export type DeletePostsMutation = { __typename?: "Mutation" } & {
  deletePosts: { __typename?: "Response" } & Pick<Response, "ok">;
};

export type UpdateAuthorMutationVariables = {
  author: InputAuthor;
};

export type UpdateAuthorMutation = { __typename?: "Mutation" } & {
  updateAuthor: Maybe<
    { __typename?: "AuthorResponse" } & Pick<AuthorResponse, "ok"> & {
        errors: Maybe<
          Array<{ __typename?: "Error" } & Pick<Error, "path" | "message">>
        >;
      }
  >;
};

export type CreateAuthorMutationVariables = {
  email: Scalars["String"];
  fname?: Maybe<Scalars["String"]>;
  lname?: Maybe<Scalars["String"]>;
  roleName?: Maybe<EnumRoles>;
};

export type CreateAuthorMutation = { __typename?: "Mutation" } & {
  createAuthor: { __typename?: "CreateAuthorResponse" } & Pick<
    CreateAuthorResponse,
    "ok"
  > & {
      errors: Maybe<
        Array<{ __typename?: "Error" } & Pick<Error, "path" | "message">>
      >;
    };
};

export type UpdatePostMutationVariables = {
  data?: Maybe<InputUpdatePost>;
};

export type UpdatePostMutation = { __typename?: "Mutation" } & {
  updatePost: { __typename?: "Response" } & Pick<Response, "ok"> & {
      errors: Maybe<
        Array<{ __typename?: "Error" } & Pick<Error, "path" | "message">>
      >;
      post: Maybe<
        { __typename?: "Post" } & Pick<
          Post,
          | "id"
          | "title"
          | "md"
          | "md_draft"
          | "html"
          | "slug"
          | "type"
          | "status"
          | "excerpt"
          | "featured"
          | "createdAt"
          | "publishedAt"
          | "scheduledAt"
        > & {
            author: { __typename?: "Author" } & Pick<
              Author,
              "username" | "lname" | "fname" | "avatar" | "bio"
            >;
            cover_image: { __typename?: "Image" } & Pick<
              Image,
              "width" | "height" | "src"
            >;
            tags: Array<
              { __typename?: "Taxonomy" } & Pick<
                Taxonomy,
                "id" | "name" | "slug"
              >
            >;
          }
      >;
    };
};

export type InsertMediaMutationVariables = {
  url: Scalars["String"];
};

export type InsertMediaMutation = { __typename?: "Mutation" } & {
  insertMedia: Maybe<
    { __typename?: "Media" } & Pick<Media, "url" | "id" | "createdAt">
  >;
};

export type DeleteMediaMutationVariables = {
  ids: Array<Scalars["Int"]>;
};

export type DeleteMediaMutation = { __typename?: "Mutation" } & {
  deleteMedia: Maybe<
    { __typename?: "DeleteResponse" } & Pick<DeleteResponse, "ok">
  >;
};

export type UpdateMediaMutationVariables = {
  id: Scalars["Int"];
  name?: Maybe<Scalars["String"]>;
  description?: Maybe<Scalars["String"]>;
};

export type UpdateMediaMutation = { __typename?: "Mutation" } & {
  updateMedia: Maybe<
    { __typename?: "UpdateResponse" } & Pick<UpdateResponse, "ok"> & {
        errors: Maybe<
          Array<
            Maybe<{ __typename?: "Error" } & Pick<Error, "message" | "path">>
          >
        >;
      }
  >;
};

export type LoginMutationVariables = {
  username: Scalars["String"];
  password: Scalars["String"];
};

export type LoginMutation = { __typename?: "Mutation" } & {
  login: { __typename?: "LoginResponse" } & Pick<
    LoginResponse,
    "ok" | "token"
  > & {
      errors: Maybe<
        Array<{ __typename?: "Error" } & Pick<Error, "message" | "path">>
      >;
    };
};

export type ForgotPasswordMutationVariables = {
  email: Scalars["String"];
};

export type ForgotPasswordMutation = { __typename?: "Mutation" } & {
  forgotPassword: { __typename?: "ForgotPasswordResponse" } & Pick<
    ForgotPasswordResponse,
    "ok" | "msg"
  >;
};

export type ResetPasswordMutationVariables = {
  token: Scalars["String"];
  password: Scalars["String"];
};

export type ResetPasswordMutation = { __typename?: "Mutation" } & {
  resetPassword: { __typename?: "ForgotPasswordResponse" } & Pick<
    ForgotPasswordResponse,
    "ok" | "msg"
  >;
};

export type PostsQueryVariables = {
  filters?: Maybe<PostsFilters>;
};

export type PostsQuery = { __typename?: "Query" } & {
  posts: { __typename?: "PostsNode" } & Pick<PostsNode, "count"> & {
      rows: Array<{ __typename?: "Post" } & PostFieldsFragment>;
    };
};

export type PostQueryVariables = {
  filters?: Maybe<PostFilters>;
};

export type PostQuery = { __typename?: "Query" } & {
  post: Maybe<{ __typename?: "Post" } & PostFieldsFragment>;
};

export type MediaQueryVariables = {
  filters?: Maybe<MediaFilters>;
};

export type MediaQuery = { __typename?: "Query" } & {
  media: { __typename?: "MediaNode" } & Pick<MediaNode, "count"> & {
      rows: Array<
        { __typename?: "Media" } & Pick<
          Media,
          | "id"
          | "url"
          | "authorId"
          | "createdAt"
          | "name"
          | "description"
          | "width"
          | "height"
        >
      >;
    };
};

export type AuthorsQueryVariables = {};

export type AuthorsQuery = { __typename?: "Query" } & {
  authors: Array<
    { __typename?: "Author" } & Pick<
      Author,
      "id" | "email" | "fname" | "lname" | "username" | "avatar" | "bio"
    > & {
        social: Maybe<
          { __typename?: "TypeSocial" } & Pick<
            TypeSocial,
            "github" | "facebook" | "twitter" | "instagram"
          >
        >;
        role: Maybe<
          { __typename?: "Role" } & Pick<Role, "name"> & {
              permissions: Maybe<
                Array<
                  Maybe<
                    { __typename?: "Permission" } & Pick<Permission, "name">
                  >
                >
              >;
            }
        >;
      }
  >;
};

export type AuthorQueryVariables = {
  id: Scalars["Int"];
};

export type AuthorQuery = { __typename?: "Query" } & {
  author: { __typename?: "Author" } & Pick<
    Author,
    "id" | "username" | "email" | "fname" | "lname" | "avatar" | "bio"
  > & {
      social: Maybe<
        { __typename?: "TypeSocial" } & Pick<
          TypeSocial,
          "facebook" | "instagram" | "github" | "twitter"
        >
      >;
      role: Maybe<
        { __typename?: "Role" } & Pick<Role, "name"> & {
            permissions: Maybe<
              Array<
                Maybe<{ __typename?: "Permission" } & Pick<Permission, "name">>
              >
            >;
          }
      >;
    };
};

export type RolesQueryVariables = {};

export type RolesQuery = { __typename?: "Query" } & {
  roles: Array<{ __typename?: "Role" } & Pick<Role, "id" | "name">>;
};

export type SettingsQueryVariables = {};

export type SettingsQuery = { __typename?: "Query" } & {
  settings: { __typename?: "Setting" } & Pick<
    Setting,
    | "site_title"
    | "site_tagline"
    | "site_email"
    | "site_url"
    | "site_footer"
    | "site_description"
    | "subscribe_embed"
    | "social_twitter"
    | "social_facebook"
    | "social_instagram"
    | "social_github"
    | "displayAuthorInfo"
    | "cloudinary_key"
    | "cloudinary_name"
    | "cloudinary_secret"
    | "css"
    | "google_analytics"
    | "locale"
    | "theme"
    | "disqus_id"
  > & {
      menu: Array<
        { __typename?: "Navigation" } & Pick<
          Navigation,
          "label" | "original_name" | "slug" | "type"
        >
      >;
      banner: { __typename?: "Image" } & Pick<
        Image,
        "src" | "width" | "height"
      >;
      site_logo: { __typename?: "Image" } & Pick<
        Image,
        "src" | "width" | "height"
      >;
      site_favicon: { __typename?: "Image" } & Pick<
        Image,
        "src" | "width" | "height"
      >;
    };
};

export type GlobalSearchQueryVariables = {
  keyword?: Maybe<Scalars["String"]>;
};

export type GlobalSearchQuery = { __typename?: "Query" } & {
  globalSearch: Maybe<
    { __typename?: "SearchResponse" } & Pick<SearchResponse, "ok"> & {
        data: Maybe<
          { __typename?: "SearchData" } & {
            pages: Maybe<
              Array<
                Maybe<
                  { __typename?: "SearchResults" } & Pick<
                    SearchResults,
                    "id" | "title"
                  >
                >
              >
            >;
            posts: Maybe<
              Array<
                Maybe<
                  { __typename?: "SearchResults" } & Pick<
                    SearchResults,
                    "id" | "title"
                  >
                >
              >
            >;
            tags: Maybe<
              Array<
                Maybe<
                  { __typename?: "SearchResults" } & Pick<
                    SearchResults,
                    "id" | "title"
                  >
                >
              >
            >;
          }
        >;
      }
  >;
};

export type TaxonomiesQueryVariables = {
  filters?: Maybe<TaxonomyFilters>;
};

export type TaxonomiesQuery = { __typename?: "Query" } & {
  taxonomies: Array<
    { __typename?: "Taxonomy" } & Pick<
      Taxonomy,
      "id" | "name" | "desc" | "slug" | "type"
    > & {
        posts: Maybe<
          { __typename?: "PostsNode" } & Pick<PostsNode, "count"> & {
              rows: Array<{ __typename?: "Post" } & Pick<Post, "id">>;
            }
        >;
      }
  >;
};

export type StatsQueryVariables = {};

export type StatsQuery = { __typename?: "Query" } & {
  stats: Maybe<
    { __typename?: "Stats" } & Pick<Stats, "tags" | "media"> & {
        posts: Maybe<
          { __typename?: "PostStatus" } & Pick<
            PostStatus,
            "published" | "drafts"
          >
        >;
        pages: Maybe<
          { __typename?: "PostStatus" } & Pick<
            PostStatus,
            "published" | "drafts"
          >
        >;
      }
  >;
};

export type ThemesQueryVariables = {
  name?: Maybe<Scalars["String"]>;
};

export type ThemesQuery = { __typename?: "Query" } & {
  themes: Array<
    { __typename?: "Theme" } & Pick<Theme, "name"> & {
        settings: Array<
          { __typename?: "ThemeSettings" } & Pick<
            ThemeSettings,
            | "name"
            | "type"
            | "tag"
            | "defaultValue"
            | "changedValue"
            | "helpText"
            | "label"
            | "placeholder"
            | "options"
          >
        >;
      }
  >;
};

export type AdjacentPostsQueryVariables = {
  slug?: Maybe<Scalars["String"]>;
};

export type AdjacentPostsQuery = { __typename?: "Query" } & {
  adjacentPosts: Maybe<
    { __typename?: "AdjacentPosts" } & {
      next: Maybe<
        { __typename?: "Post" } & Pick<
          Post,
          "title" | "slug" | "publishedAt"
        > & {
            cover_image: { __typename?: "Image" } & Pick<
              Image,
              "width" | "height" | "src"
            >;
          }
      >;
      previous: Maybe<
        { __typename?: "Post" } & Pick<
          Post,
          "title" | "slug" | "publishedAt"
        > & {
            cover_image: { __typename?: "Image" } & Pick<
              Image,
              "width" | "height" | "src"
            >;
          }
      >;
    }
  >;
};

export type ValidateTokenQueryVariables = {};

export type ValidateTokenQuery = { __typename?: "Query" } & {
  validateToken: Maybe<
    { __typename?: "CreateAuthorResponse" } & Pick<
      CreateAuthorResponse,
      "ok"
    > & {
        errors: Maybe<Array<{ __typename?: "Error" } & Pick<Error, "message">>>;
      }
  >;
};
