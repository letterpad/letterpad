export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K];
};
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]?: Maybe<T[SubKey]>;
};
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]: Maybe<T[SubKey]>;
};
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  Date: any;
};

export type Author = {
  __typename?: "Author";
  accessToken?: Maybe<Scalars["String"]>;
  analytics_id?: Maybe<Scalars["Int"]>;
  analytics_uuid?: Maybe<Scalars["String"]>;
  avatar?: Maybe<Scalars["String"]>;
  bio?: Maybe<Scalars["String"]>;
  company_name?: Maybe<Scalars["String"]>;
  email: Scalars["String"];
  first_post_published?: Maybe<Scalars["Boolean"]>;
  id: Scalars["Int"];
  name: Scalars["String"];
  occupation?: Maybe<Scalars["String"]>;
  permissions?: Maybe<Array<Permissions>>;
  profile_updated?: Maybe<Scalars["Boolean"]>;
  role?: Maybe<Role>;
  settings_updated?: Maybe<Scalars["Boolean"]>;
  social?: Maybe<Social>;
  username: Scalars["String"];
  verified?: Maybe<Scalars["Boolean"]>;
};

export type AuthorResponse =
  | Author
  | Exception
  | Failed
  | NotFound
  | UnAuthorized;

export type CreateDomainResponse = Domain | DomainError;

export type CreatePostResponse = Post | PostError;

export type DeleteAuthorResponse = {
  __typename?: "DeleteAuthorResponse";
  message?: Maybe<Scalars["String"]>;
  ok: Scalars["Boolean"];
};

export type DeleteTagsResponse = DeleteTagsResult | TagsError;

export type DeleteTagsResult = {
  __typename?: "DeleteTagsResult";
  ok: Scalars["Boolean"];
};

export type Domain = {
  __typename?: "Domain";
  id: Scalars["Int"];
  mapped?: Maybe<Scalars["Boolean"]>;
  name: Scalars["String"];
  ssl?: Maybe<Scalars["Boolean"]>;
};

export type DomainError = LetterpadError & {
  __typename?: "DomainError";
  message: Scalars["String"];
};

export type DomainNotFound = LetterpadError & {
  __typename?: "DomainNotFound";
  message: Scalars["String"];
};

export type DomainResponse = Domain | DomainNotFound;

export type EditTaxResponse = {
  __typename?: "EditTaxResponse";
  ok: Scalars["Boolean"];
};

export type Email = {
  __typename?: "Email";
  body: Scalars["String"];
  subject: Scalars["String"];
  template_id: Scalars["String"];
};

export type EmailError = LetterpadError & {
  __typename?: "EmailError";
  message: Scalars["String"];
};

export type EmailResponse = Email | EmailError;

export type Error = {
  __typename?: "Error";
  message?: Maybe<Scalars["String"]>;
  path: Scalars["String"];
};

export type Exception = LetterpadError & {
  __typename?: "Exception";
  message: Scalars["String"];
};

export type Failed = LetterpadError & {
  __typename?: "Failed";
  message: Scalars["String"];
  type?: Maybe<Failed>;
};

export type Forbidden = LetterpadError & {
  __typename?: "Forbidden";
  message: Scalars["String"];
  type?: Maybe<Failed>;
};

export type ForgotPasswordResponse = {
  __typename?: "ForgotPasswordResponse";
  message?: Maybe<Scalars["String"]>;
  ok: Scalars["Boolean"];
};

export type Image = {
  __typename?: "Image";
  height?: Maybe<Scalars["Int"]>;
  src?: Maybe<Scalars["String"]>;
  width?: Maybe<Scalars["Int"]>;
};

export type InputAuthor = {
  avatar?: Maybe<Scalars["String"]>;
  bio?: Maybe<Scalars["String"]>;
  company_name?: Maybe<Scalars["String"]>;
  email?: Maybe<Scalars["String"]>;
  first_post_published?: Maybe<Scalars["Boolean"]>;
  id: Scalars["Int"];
  name?: Maybe<Scalars["String"]>;
  occupation?: Maybe<Scalars["String"]>;
  password?: Maybe<Scalars["String"]>;
  profile_updated?: Maybe<Scalars["Boolean"]>;
  roleId?: Maybe<Scalars["Int"]>;
  settings_updated?: Maybe<Scalars["Boolean"]>;
  social?: Maybe<InputSocial>;
  username?: Maybe<Scalars["String"]>;
};

export type InputCreateAuthor = {
  email: Scalars["String"];
  name: Scalars["String"];
  password: Scalars["String"];
  setting?: Maybe<SettingInputType>;
  token: Scalars["String"];
  username: Scalars["String"];
};

export type InputCreatePost = {
  cover_image?: Maybe<InputImage>;
  excerpt?: Maybe<Scalars["String"]>;
  featured?: Maybe<Scalars["Boolean"]>;
  html?: Maybe<Scalars["String"]>;
  page_data?: Maybe<Scalars["String"]>;
  page_type?: Maybe<Scalars["String"]>;
  slug?: Maybe<Scalars["String"]>;
  status?: Maybe<PostStatusOptions>;
  tags?: Maybe<Array<Maybe<TagsInputType>>>;
  title?: Maybe<Scalars["String"]>;
  type?: Maybe<PostTypes>;
};

export type InputDomain = {
  mapped?: Maybe<Scalars["Boolean"]>;
  name?: Maybe<Scalars["String"]>;
  ssl?: Maybe<Scalars["Boolean"]>;
};

export type InputImage = {
  height?: Maybe<Scalars["Int"]>;
  src: Scalars["String"];
  width?: Maybe<Scalars["Int"]>;
};

export type InputNavigation = {
  label: Scalars["String"];
  original_name: Scalars["String"];
  slug: Scalars["String"];
  type: NavigationType;
};

export type InputSocial = {
  facebook?: Maybe<Scalars["String"]>;
  github?: Maybe<Scalars["String"]>;
  instagram?: Maybe<Scalars["String"]>;
  linkedin?: Maybe<Scalars["String"]>;
  twitter?: Maybe<Scalars["String"]>;
};

export type InputTags = {
  name: Scalars["String"];
  old_name?: Maybe<Scalars["String"]>;
  slug?: Maybe<Scalars["String"]>;
};

export type InputUpdateMedia = {
  description?: Maybe<Scalars["String"]>;
  id: Scalars["Int"];
  name?: Maybe<Scalars["String"]>;
};

export type InputUpdatePost = {
  cover_image?: Maybe<InputImage>;
  excerpt?: Maybe<Scalars["String"]>;
  featured?: Maybe<Scalars["Boolean"]>;
  html?: Maybe<Scalars["String"]>;
  html_draft?: Maybe<Scalars["String"]>;
  id: Scalars["Int"];
  page_data?: Maybe<Scalars["String"]>;
  page_type?: Maybe<Scalars["String"]>;
  publishedAt?: Maybe<Scalars["Date"]>;
  scheduledAt?: Maybe<Scalars["Date"]>;
  slug?: Maybe<Scalars["String"]>;
  status?: Maybe<PostStatusOptions>;
  tags?: Maybe<Array<TagsInputType>>;
  title?: Maybe<Scalars["String"]>;
  type?: Maybe<PostTypes>;
  updatedAt?: Maybe<Scalars["Date"]>;
};

export type InputUpdateSubscriber = {
  secret_id?: Maybe<Scalars["String"]>;
  verified?: Maybe<Scalars["Boolean"]>;
};

export type InvalidArguments = LetterpadError & {
  __typename?: "InvalidArguments";
  message: Scalars["String"];
};

export type LetterpadError = {
  message: Scalars["String"];
};

export type LetterpadPostFilters = {
  slug: Scalars["String"];
  username: Scalars["String"];
};

export type LoginData = {
  email: Scalars["String"];
  password: Scalars["String"];
};

export type LoginError = LetterpadError & {
  __typename?: "LoginError";
  message: Scalars["String"];
};

export type LoginResponse = Author | LoginError;

export type Media = {
  __typename?: "Media";
  authorId?: Maybe<Scalars["Int"]>;
  createdAt: Scalars["Date"];
  description?: Maybe<Scalars["String"]>;
  height: Scalars["Int"];
  id: Scalars["Int"];
  name: Scalars["String"];
  url: Scalars["String"];
  width: Scalars["Int"];
};

export type MediaDeleteResponse = MediaDeleteResult | MediaError;

export type MediaDeleteResult = {
  __typename?: "MediaDeleteResult";
  ok: Scalars["Boolean"];
};

export type MediaError = LetterpadError & {
  __typename?: "MediaError";
  message: Scalars["String"];
};

export type MediaFilters = {
  authorId?: Maybe<Scalars["Int"]>;
  cursor?: Maybe<Scalars["Int"]>;
  id?: Maybe<Scalars["Int"]>;
  limit?: Maybe<Scalars["Int"]>;
  page?: Maybe<Scalars["Int"]>;
};

export type MediaNode = {
  __typename?: "MediaNode";
  count: Scalars["Int"];
  rows: Array<Media>;
};

export type MediaUpdateResponse = MediaError | MediaUpdateResult;

export type MediaUpdateResult = {
  __typename?: "MediaUpdateResult";
  ok: Scalars["Boolean"];
};

export type Mutation = {
  __typename?: "Mutation";
  addSubscriber?: Maybe<SubscribersAddResult>;
  createAuthor?: Maybe<AuthorResponse>;
  createOrUpdateDomain: UpdateDomainResponse;
  createPost: CreatePostResponse;
  deleteAuthor?: Maybe<DeleteAuthorResponse>;
  deleteMedia?: Maybe<MediaDeleteResponse>;
  deleteTags: DeleteTagsResponse;
  forgotPassword: ForgotPasswordResponse;
  login?: Maybe<LoginResponse>;
  removeDomain: RemoveDomainResponse;
  resetPassword: ForgotPasswordResponse;
  updateAuthor?: Maybe<AuthorResponse>;
  updateMedia?: Maybe<MediaUpdateResponse>;
  updateOptions?: Maybe<SettingResponse>;
  updatePost: UpdatePostResponse;
  updateSubscriber: SubscribersUpdateResult;
  updateTags: UpdateTagsResponse;
};

export type MutationAddSubscriberArgs = {
  email: Scalars["String"];
};

export type MutationCreateAuthorArgs = {
  data: InputCreateAuthor;
};

export type MutationCreateOrUpdateDomainArgs = {
  data: InputDomain;
};

export type MutationCreatePostArgs = {
  data?: Maybe<InputCreatePost>;
};

export type MutationDeleteMediaArgs = {
  ids: Array<Scalars["Int"]>;
};

export type MutationDeleteTagsArgs = {
  name: Scalars["String"];
};

export type MutationForgotPasswordArgs = {
  email: Scalars["String"];
};

export type MutationLoginArgs = {
  data?: Maybe<LoginData>;
};

export type MutationResetPasswordArgs = {
  password: Scalars["String"];
  token: Scalars["String"];
};

export type MutationUpdateAuthorArgs = {
  author: InputAuthor;
};

export type MutationUpdateMediaArgs = {
  data: InputUpdateMedia;
};

export type MutationUpdateOptionsArgs = {
  options: Array<SettingInputType>;
};

export type MutationUpdatePostArgs = {
  data?: Maybe<InputUpdatePost>;
};

export type MutationUpdateSubscriberArgs = {
  data: InputUpdateSubscriber;
};

export type MutationUpdateTagsArgs = {
  data?: Maybe<InputTags>;
};

export type Navigation = {
  __typename?: "Navigation";
  label: Scalars["String"];
  original_name: Scalars["String"];
  slug: Scalars["String"];
  type: NavigationType;
};

export enum NavigationType {
  Custom = "custom",
  Page = "page",
  Tag = "tag",
}

export type NotFound = LetterpadError & {
  __typename?: "NotFound";
  message: Scalars["String"];
};

export enum Permissions {
  ManageAllPosts = "MANAGE_ALL_POSTS",
  ManageOwnPosts = "MANAGE_OWN_POSTS",
  ManageSettings = "MANAGE_SETTINGS",
  ManageUsers = "MANAGE_USERS",
  ReadOnlyPosts = "READ_ONLY_POSTS",
}

export type Post = {
  __typename?: "Post";
  author?: Maybe<AuthorResponse>;
  cover_image: Image;
  createdAt: Scalars["Date"];
  excerpt?: Maybe<Scalars["String"]>;
  featured: Scalars["Boolean"];
  html?: Maybe<Scalars["String"]>;
  html_draft?: Maybe<Scalars["String"]>;
  id: Scalars["Int"];
  page_data?: Maybe<Scalars["String"]>;
  page_type?: Maybe<Scalars["String"]>;
  publishedAt?: Maybe<Scalars["Date"]>;
  reading_time?: Maybe<Scalars["String"]>;
  scheduledAt?: Maybe<Scalars["Date"]>;
  slug?: Maybe<Scalars["String"]>;
  status: PostStatusOptions;
  tags?: Maybe<TagsResponse>;
  title: Scalars["String"];
  type: PostTypes;
  updatedAt: Scalars["Date"];
};

export type PostCountsByStatus = {
  __typename?: "PostCountsByStatus";
  drafts: Scalars["Int"];
  published: Scalars["Int"];
};

export type PostError = LetterpadError & {
  __typename?: "PostError";
  message: Scalars["String"];
};

export type PostFilters = {
  featured?: Maybe<Scalars["Boolean"]>;
  id?: Maybe<Scalars["Int"]>;
  previewHash?: Maybe<Scalars["String"]>;
  slug?: Maybe<Scalars["String"]>;
  status?: Maybe<PostStatusOptions>;
  type?: Maybe<PostTypes>;
};

export type PostResponse =
  | Exception
  | InvalidArguments
  | NotFound
  | Post
  | UnAuthorized;

export type PostsFilters = {
  author?: Maybe<Scalars["String"]>;
  cursor?: Maybe<Scalars["Int"]>;
  featured?: Maybe<Scalars["Boolean"]>;
  id?: Maybe<Scalars["Int"]>;
  limit?: Maybe<Scalars["Int"]>;
  offset?: Maybe<Scalars["Int"]>;
  page?: Maybe<Scalars["Int"]>;
  page_type?: Maybe<Scalars["String"]>;
  previewHash?: Maybe<Scalars["String"]>;
  slug?: Maybe<Scalars["String"]>;
  sortBy?: Maybe<SortBy>;
  status?: Maybe<PostStatusOptions>;
  tag?: Maybe<Scalars["String"]>;
  tagSlug?: Maybe<Scalars["String"]>;
  type?: Maybe<PostTypes>;
};

export type PostsNode = {
  __typename?: "PostsNode";
  count: Scalars["Int"];
  rows: Array<Post>;
};

export type PostsResponse = Exception | PostsNode | UnAuthorized;

export enum PostStatusOptions {
  Draft = "draft",
  Published = "published",
  Trashed = "trashed",
}

export type PostTrashed = {
  __typename?: "PostTrashed";
  message: Scalars["String"];
};

export enum PostTypes {
  Page = "page",
  Post = "post",
}

export type Query = {
  __typename?: "Query";
  domain: DomainResponse;
  email: EmailResponse;
  emails: Array<Maybe<Email>>;
  letterpadLatestPost: PostResponse;
  letterpadLatestPosts: PostsResponse;
  me?: Maybe<AuthorResponse>;
  media: MediaNode;
  post: PostResponse;
  posts: PostsResponse;
  settings: SettingResponse;
  sitemap: SiteMapResponse;
  stats?: Maybe<StatsResponse>;
  subscriber: SubscriberResponse;
  subscribers: SubscribersNode;
  tag: TagResponse;
  tags: TagsResponse;
};

export type QueryEmailArgs = {
  template_id?: Maybe<Scalars["String"]>;
};

export type QueryLetterpadLatestPostArgs = {
  filters?: Maybe<LetterpadPostFilters>;
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

export type QuerySubscriberArgs = {
  subscriber_id?: Maybe<Scalars["Int"]>;
};

export type QuerySubscribersArgs = {
  author_id?: Maybe<Scalars["Int"]>;
};

export type QueryTagArgs = {
  slug: Scalars["String"];
};

export type QueryTagsArgs = {
  filters?: Maybe<TagsFilters>;
};

export type RemoveDomainResponse = {
  __typename?: "RemoveDomainResponse";
  message?: Maybe<Scalars["String"]>;
  ok: Scalars["Boolean"];
};

export type Response = {
  __typename?: "Response";
  errors?: Maybe<Array<Error>>;
  ok: Scalars["Boolean"];
  post?: Maybe<Post>;
};

export enum Role {
  Admin = "ADMIN",
  Author = "AUTHOR",
  Reader = "READER",
  Reviewer = "REVIEWER",
}

export type Setting = {
  __typename?: "Setting";
  banner?: Maybe<Image>;
  client_token: Scalars["String"];
  cloudinary_key?: Maybe<Scalars["String"]>;
  cloudinary_name?: Maybe<Scalars["String"]>;
  cloudinary_secret?: Maybe<Scalars["String"]>;
  css?: Maybe<Scalars["String"]>;
  display_author_info: Scalars["Boolean"];
  id: Scalars["Int"];
  intro_dismissed: Scalars["Boolean"];
  menu: Array<Navigation>;
  show_about_page?: Maybe<Scalars["Boolean"]>;
  show_tags_page?: Maybe<Scalars["Boolean"]>;
  site_description?: Maybe<Scalars["String"]>;
  site_email: Scalars["String"];
  site_favicon?: Maybe<Image>;
  site_footer?: Maybe<Scalars["String"]>;
  site_logo?: Maybe<Image>;
  site_tagline?: Maybe<Scalars["String"]>;
  site_title: Scalars["String"];
  site_url: Scalars["String"];
  subscribe_embed?: Maybe<Scalars["String"]>;
  theme?: Maybe<Scalars["String"]>;
};

export type SettingError = LetterpadError & {
  __typename?: "SettingError";
  message: Scalars["String"];
};

export type SettingInputType = {
  banner?: Maybe<InputImage>;
  cloudinary_key?: Maybe<Scalars["String"]>;
  cloudinary_name?: Maybe<Scalars["String"]>;
  cloudinary_secret?: Maybe<Scalars["String"]>;
  css?: Maybe<Scalars["String"]>;
  display_author_info?: Maybe<Scalars["Boolean"]>;
  intro_dismissed?: Maybe<Scalars["Boolean"]>;
  menu?: Maybe<Array<InputNavigation>>;
  show_about_page?: Maybe<Scalars["Boolean"]>;
  show_tags_page?: Maybe<Scalars["Boolean"]>;
  site_description?: Maybe<Scalars["String"]>;
  site_email?: Maybe<Scalars["String"]>;
  site_favicon?: Maybe<InputImage>;
  site_footer?: Maybe<Scalars["String"]>;
  site_logo?: Maybe<InputImage>;
  site_tagline?: Maybe<Scalars["String"]>;
  site_title?: Maybe<Scalars["String"]>;
  site_url?: Maybe<Scalars["String"]>;
  subscribe_embed?: Maybe<Scalars["String"]>;
  theme?: Maybe<Scalars["String"]>;
};

export type SettingResponse = NotFound | Setting | UnAuthorized;

export type SiteMapError = {
  __typename?: "SiteMapError";
  message?: Maybe<Scalars["String"]>;
};

export type SiteMapList = {
  __typename?: "SiteMapList";
  rows: Array<SiteMapNode>;
};

export type SiteMapNode = {
  __typename?: "SiteMapNode";
  changefreq?: Maybe<Scalars["String"]>;
  lastmod?: Maybe<Scalars["String"]>;
  priority: Scalars["Int"];
  route: Scalars["String"];
};

export type SiteMapResponse = SiteMapError | SiteMapList;

export type Social = {
  __typename?: "Social";
  facebook?: Maybe<Scalars["String"]>;
  github?: Maybe<Scalars["String"]>;
  instagram?: Maybe<Scalars["String"]>;
  linkedin?: Maybe<Scalars["String"]>;
  twitter?: Maybe<Scalars["String"]>;
};

export enum SortBy {
  Asc = "asc",
  Desc = "desc",
}

export type Stats = {
  __typename?: "Stats";
  media: Scalars["Int"];
  pages: PostCountsByStatus;
  posts: PostCountsByStatus;
  tags: Scalars["Int"];
};

export type StatsError = LetterpadError & {
  __typename?: "StatsError";
  message: Scalars["String"];
};

export type StatsResponse = Stats | StatsError;

export type Subscriber = {
  __typename?: "Subscriber";
  author_id: Scalars["Int"];
  createdAt: Scalars["Date"];
  email: Scalars["String"];
  id: Scalars["Int"];
  verified: Scalars["Boolean"];
};

export type SubscriberError = {
  __typename?: "SubscriberError";
  message?: Maybe<Scalars["String"]>;
};

export type SubscriberResponse = Subscriber | SubscriberError;

export type SubscribersAddResult = {
  __typename?: "SubscribersAddResult";
  message?: Maybe<Scalars["String"]>;
  ok: Scalars["Boolean"];
};

export type SubscribersNode = {
  __typename?: "SubscribersNode";
  count: Scalars["Int"];
  rows: Array<Subscriber>;
};

export type SubscribersUpdateResult = {
  __typename?: "SubscribersUpdateResult";
  message?: Maybe<Scalars["String"]>;
  ok: Scalars["Boolean"];
};

export type Tag = {
  __typename?: "Tag";
  name: Scalars["String"];
  posts?: Maybe<PostsResponse>;
  slug: Scalars["String"];
};

export type TagResponse = Exception | Tag;

export type TagResultError = LetterpadError & {
  __typename?: "TagResultError";
  message: Scalars["String"];
};

export type TagsError = LetterpadError & {
  __typename?: "TagsError";
  message: Scalars["String"];
};

export type TagsFilters = {
  active?: Maybe<Scalars["Boolean"]>;
  name?: Maybe<Scalars["String"]>;
  suggest?: Maybe<Scalars["Boolean"]>;
};

export type TagsInputType = {
  name: Scalars["String"];
  slug: Scalars["String"];
};

export type TagsNode = {
  __typename?: "TagsNode";
  rows: Array<Tag>;
};

export type TagsResponse = Exception | TagsError | TagsNode;

export type UnAuthorized = LetterpadError & {
  __typename?: "UnAuthorized";
  message: Scalars["String"];
};

export type Unexpected = LetterpadError & {
  __typename?: "Unexpected";
  message: Scalars["String"];
};

export type UpdateDomainResponse = {
  __typename?: "UpdateDomainResponse";
  message?: Maybe<Scalars["String"]>;
  ok: Scalars["Boolean"];
};

export type UpdatePostResponse = Post | PostError | PostTrashed;

export type UpdateTagsResponse = EditTaxResponse | TagsError;

export type PostQueryVariables = Exact<{
  slug?: Maybe<Scalars["String"]>;
}>;

export type PostQuery = { __typename?: "Query" } & {
  post:
    | ({ __typename: "Exception" } & Pick<Exception, "message">)
    | ({ __typename: "InvalidArguments" } & Pick<InvalidArguments, "message">)
    | ({ __typename: "NotFound" } & Pick<NotFound, "message">)
    | ({ __typename: "Post" } & PageFragmentFragment)
    | ({ __typename: "UnAuthorized" } & Pick<UnAuthorized, "message">);
};

export type PageFragmentFragment = { __typename?: "Post" } & Pick<
  Post,
  | "id"
  | "slug"
  | "title"
  | "reading_time"
  | "page_type"
  | "page_data"
  | "html"
  | "type"
  | "publishedAt"
  | "updatedAt"
  | "excerpt"
> & {
    tags?: Maybe<
      | ({ __typename: "Exception" } & Pick<Exception, "message">)
      | ({ __typename: "TagsError" } & Pick<TagsError, "message">)
      | ({ __typename: "TagsNode" } & {
          rows: Array<{ __typename?: "Tag" } & Pick<Tag, "name" | "slug">>;
        })
    >;
    author?: Maybe<
      | ({ __typename: "Author" } & Pick<
          Author,
          "id" | "name" | "avatar" | "occupation"
        >)
      | ({ __typename: "Exception" } & Pick<Exception, "message">)
      | ({ __typename: "Failed" } & Pick<Failed, "message">)
      | ({ __typename: "NotFound" } & Pick<NotFound, "message">)
      | ({ __typename: "UnAuthorized" } & Pick<UnAuthorized, "message">)
    >;
    cover_image: { __typename?: "Image" } & Pick<Image, "src">;
  };

export type PostsQueryVariables = Exact<{
  tagSlug?: Maybe<Scalars["String"]>;
}>;

export type PostsQuery = { __typename?: "Query" } & {
  posts:
    | ({ __typename: "Exception" } & Pick<Exception, "message">)
    | ({ __typename: "PostsNode" } & PostsFragmentFragment)
    | ({ __typename: "UnAuthorized" } & Pick<UnAuthorized, "message">);
};

export type PostsFragmentFragment = { __typename?: "PostsNode" } & Pick<
  PostsNode,
  "count"
> & {
    rows: Array<
      { __typename?: "Post" } & Pick<
        Post,
        "id" | "title" | "slug" | "publishedAt" | "reading_time" | "excerpt"
      > & {
          cover_image: { __typename?: "Image" } & Pick<Image, "src">;
          author?: Maybe<
            | ({ __typename: "Author" } & Pick<Author, "name" | "avatar">)
            | ({ __typename: "Exception" } & Pick<Exception, "message">)
            | ({ __typename: "Failed" } & Pick<Failed, "message">)
            | ({ __typename: "NotFound" } & Pick<NotFound, "message">)
            | ({ __typename: "UnAuthorized" } & Pick<UnAuthorized, "message">)
          >;
          tags?: Maybe<
            | ({ __typename: "Exception" } & Pick<Exception, "message">)
            | ({ __typename: "TagsError" } & Pick<TagsError, "message">)
            | ({ __typename: "TagsNode" } & {
                rows: Array<
                  { __typename?: "Tag" } & Pick<Tag, "name" | "slug">
                >;
              })
          >;
        }
    >;
  };

export type SettingsQueryVariables = Exact<{ [key: string]: never }>;

export type SettingsQuery = { __typename?: "Query" } & {
  settings:
    | ({ __typename: "NotFound" } & Pick<NotFound, "message">)
    | ({ __typename: "Setting" } & SettingsFragmentFragment)
    | ({ __typename: "UnAuthorized" } & Pick<UnAuthorized, "message">);
};

export type SettingsFragmentFragment = { __typename?: "Setting" } & Pick<
  Setting,
  | "site_title"
  | "site_tagline"
  | "site_email"
  | "site_description"
  | "site_footer"
> & {
    banner?: Maybe<
      { __typename?: "Image" } & Pick<Image, "src" | "width" | "height">
    >;
    menu: Array<
      { __typename?: "Navigation" } & Pick<
        Navigation,
        "label" | "type" | "original_name"
      >
    >;
    site_logo?: Maybe<
      { __typename?: "Image" } & Pick<Image, "src" | "width" | "height">
    >;
    site_favicon?: Maybe<
      { __typename?: "Image" } & Pick<Image, "src" | "width" | "height">
    >;
  };

export type SitemapQueryVariables = Exact<{ [key: string]: never }>;

export type SitemapQuery = { __typename?: "Query" } & {
  sitemap:
    | ({ __typename?: "SiteMapError" } & SitemapFragment_SiteMapError_Fragment)
    | ({ __typename?: "SiteMapList" } & SitemapFragment_SiteMapList_Fragment);
};

type SitemapFragment_SiteMapError_Fragment = {
  __typename: "SiteMapError";
} & Pick<SiteMapError, "message">;

type SitemapFragment_SiteMapList_Fragment = { __typename: "SiteMapList" } & {
  rows: Array<
    { __typename?: "SiteMapNode" } & Pick<
      SiteMapNode,
      "route" | "priority" | "lastmod"
    >
  >;
};

export type SitemapFragmentFragment =
  | SitemapFragment_SiteMapError_Fragment
  | SitemapFragment_SiteMapList_Fragment;

export type TagsQueryVariables = Exact<{ [key: string]: never }>;

export type TagsQuery = { __typename?: "Query" } & {
  tags:
    | ({ __typename: "Exception" } & Pick<Exception, "message">)
    | ({ __typename: "TagsError" } & Pick<TagsError, "message">)
    | ({ __typename: "TagsNode" } & {
        rows: Array<{ __typename?: "Tag" } & Pick<Tag, "name" | "slug">>;
      });
};

export const PageFragmentFragmentDoc = `
    fragment pageFragment on Post {
  id
  slug
  title
  reading_time
  page_type
  page_data
  html
  type
  publishedAt
  updatedAt
  excerpt
  tags {
    __typename
    ... on LetterpadError {
      message
    }
    ... on TagsNode {
      rows {
        name
        slug
      }
    }
  }
  author {
    __typename
    ... on LetterpadError {
      message
    }
    ... on Author {
      id
      name
      avatar
      occupation
    }
  }
  cover_image {
    src
  }
}
    `;
export const PostsFragmentFragmentDoc = `
    fragment postsFragment on PostsNode {
  count
  rows {
    id
    title
    slug
    cover_image {
      src
    }
    author {
      __typename
      ... on LetterpadError {
        message
      }
      ... on Author {
        name
        avatar
        __typename
      }
    }
    publishedAt
    reading_time
    excerpt
    tags {
      __typename
      ... on LetterpadError {
        message
      }
      ... on TagsNode {
        rows {
          name
          slug
        }
      }
    }
  }
}
    `;
export const SettingsFragmentFragmentDoc = `
    fragment settingsFragment on Setting {
  banner {
    src
    width
    height
  }
  site_title
  site_tagline
  site_email
  site_description
  menu {
    label
    type
    original_name
    label
  }
  site_logo {
    src
    width
    height
  }
  site_favicon {
    src
    width
    height
  }
  site_footer
}
    `;
export const SitemapFragmentFragmentDoc = `
    fragment sitemapFragment on SiteMapResponse {
  ... on SiteMapList {
    rows {
      route
      priority
      lastmod
    }
  }
  ... on SiteMapError {
    message
  }
  __typename
}
    `;
export const PostDocument = `
    query post($slug: String) {
  post(filters: {slug: $slug}) {
    __typename
    ...pageFragment
    ... on LetterpadError {
      message
    }
  }
}
    ${PageFragmentFragmentDoc}`;
export const PostsDocument = `
    query posts($tagSlug: String) {
  posts(filters: {tagSlug: $tagSlug}) {
    __typename
    ...postsFragment
    ... on LetterpadError {
      message
    }
  }
}
    ${PostsFragmentFragmentDoc}`;
export const SettingsDocument = `
    query settings {
  settings {
    __typename
    ...settingsFragment
    ... on LetterpadError {
      message
    }
  }
}
    ${SettingsFragmentFragmentDoc}`;
export const SitemapDocument = `
    query sitemap {
  sitemap {
    ...sitemapFragment
  }
}
    ${SitemapFragmentFragmentDoc}`;
export const TagsDocument = `
    query tags {
  tags {
    __typename
    ... on LetterpadError {
      message
    }
    ... on TagsNode {
      rows {
        name
        slug
      }
    }
  }
}
    `;
export type Requester<C = {}, E = unknown> = <R, V>(
  doc: string,
  vars?: V,
  options?: C
) => Promise<R> | AsyncIterable<R>;
export function getSdk<C, E>(requester: Requester<C, E>) {
  return {
    post(variables?: PostQueryVariables, options?: C): Promise<PostQuery> {
      return requester<PostQuery, PostQueryVariables>(
        PostDocument,
        variables,
        options
      ) as Promise<PostQuery>;
    },
    posts(variables?: PostsQueryVariables, options?: C): Promise<PostsQuery> {
      return requester<PostsQuery, PostsQueryVariables>(
        PostsDocument,
        variables,
        options
      ) as Promise<PostsQuery>;
    },
    settings(
      variables?: SettingsQueryVariables,
      options?: C
    ): Promise<SettingsQuery> {
      return requester<SettingsQuery, SettingsQueryVariables>(
        SettingsDocument,
        variables,
        options
      ) as Promise<SettingsQuery>;
    },
    sitemap(
      variables?: SitemapQueryVariables,
      options?: C
    ): Promise<SitemapQuery> {
      return requester<SitemapQuery, SitemapQueryVariables>(
        SitemapDocument,
        variables,
        options
      ) as Promise<SitemapQuery>;
    },
    tags(variables?: TagsQueryVariables, options?: C): Promise<TagsQuery> {
      return requester<TagsQuery, TagsQueryVariables>(
        TagsDocument,
        variables,
        options
      ) as Promise<TagsQuery>;
    },
  };
}
export type Sdk = ReturnType<typeof getSdk>;
