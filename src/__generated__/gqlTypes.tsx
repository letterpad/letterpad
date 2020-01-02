import gql from 'graphql-tag';
import * as ApolloReactCommon from '@apollo/react-common';
export type Maybe<T> = T | null;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string,
  String: string,
  Boolean: boolean,
  Int: number,
  Float: number,
  Date: any,
};

export type AdjacentPosts = {
   __typename?: 'AdjacentPosts',
  previous?: Maybe<Post>,
  next?: Maybe<Post>,
};

export type Author = {
   __typename?: 'Author',
  id?: Maybe<Scalars['Int']>,
  username?: Maybe<Scalars['String']>,
  email?: Maybe<Scalars['String']>,
  fname: Scalars['String'],
  lname: Scalars['String'],
  social?: Maybe<TypeSocial>,
  role?: Maybe<Role>,
  bio?: Maybe<Scalars['String']>,
  avatar?: Maybe<Scalars['String']>,
};

export type AuthorResponse = {
   __typename?: 'AuthorResponse',
  ok: Scalars['Boolean'],
  errors?: Maybe<Array<Error>>,
  data?: Maybe<Author>,
};

export type CreateAuthorResponse = {
   __typename?: 'CreateAuthorResponse',
  ok: Scalars['Boolean'],
  errors?: Maybe<Array<Error>>,
};


export type DeleteResponse = {
   __typename?: 'DeleteResponse',
  ok: Scalars['Boolean'],
};

export type EditTaxResponse = {
   __typename?: 'EditTaxResponse',
  ok: Scalars['Boolean'],
  id?: Maybe<Scalars['Int']>,
  errors?: Maybe<Array<Error>>,
};

export enum EnumPermissions {
  ReadOnlyPosts = 'READ_ONLY_POSTS',
  ManageAllPosts = 'MANAGE_ALL_POSTS',
  ManageUsers = 'MANAGE_USERS',
  ManageSettings = 'MANAGE_SETTINGS'
}

export enum EnumRoles {
  Admin = 'ADMIN',
  Reviewer = 'REVIEWER',
  Author = 'AUTHOR',
  Reader = 'READER'
}

export type Error = {
   __typename?: 'Error',
  path: Scalars['String'],
  message?: Maybe<Scalars['String']>,
};

export type ForgotPasswordResponse = {
   __typename?: 'ForgotPasswordResponse',
  ok: Scalars['Boolean'],
  msg?: Maybe<Scalars['String']>,
};

export type InputAuthor = {
  id: Scalars['Int'],
  email?: Maybe<Scalars['String']>,
  fname?: Maybe<Scalars['String']>,
  lname?: Maybe<Scalars['String']>,
  bio?: Maybe<Scalars['String']>,
  social?: Maybe<Social>,
  password?: Maybe<Scalars['String']>,
  roleId?: Maybe<Scalars['Int']>,
  avatar?: Maybe<Scalars['String']>,
};

export type InputCreatePost = {
  title?: Maybe<Scalars['String']>,
  body?: Maybe<Scalars['String']>,
  authorId?: Maybe<Scalars['Int']>,
  excerpt?: Maybe<Scalars['String']>,
  cover_image?: Maybe<Scalars['String']>,
  type?: Maybe<Scalars['String']>,
  status?: Maybe<PostStatusOptions>,
  slug?: Maybe<Scalars['String']>,
  taxonomies?: Maybe<Array<Maybe<TaxonomyInputType>>>,
};

export type InputThemeSettings = {
  name: Scalars['String'],
  type: ThemeSettingsUiInputTypes,
  tag: ThemeSettingsUiTags,
  options?: Maybe<Array<Maybe<Scalars['String']>>>,
  placeholder?: Maybe<Scalars['String']>,
  defaultValue?: Maybe<Scalars['String']>,
  changedValue?: Maybe<Scalars['String']>,
  selectedValue?: Maybe<Scalars['String']>,
  label: Scalars['String'],
  helpText?: Maybe<Scalars['String']>,
};

export type InputUpdatePost = {
  id: Scalars['Int'],
  title?: Maybe<Scalars['String']>,
  body?: Maybe<Scalars['String']>,
  authorId?: Maybe<Scalars['Int']>,
  excerpt?: Maybe<Scalars['String']>,
  cover_image?: Maybe<Scalars['String']>,
  type?: Maybe<Scalars['String']>,
  status?: Maybe<PostStatusOptions>,
  slug?: Maybe<Scalars['String']>,
  taxonomies?: Maybe<Array<Maybe<TaxonomyInputType>>>,
};

export type LoginResponse = {
   __typename?: 'LoginResponse',
  ok: Scalars['Boolean'],
  token?: Maybe<Scalars['String']>,
  data?: Maybe<Author>,
  errors?: Maybe<Array<Error>>,
};

export type Media = {
   __typename?: 'Media',
  id: Scalars['Int'],
  authorId: Scalars['Int'],
  url: Scalars['String'],
  createdAt: Scalars['Date'],
  name?: Maybe<Scalars['String']>,
  description?: Maybe<Scalars['String']>,
};

export type MediaFiltersWithPagination = {
  id?: Maybe<Scalars['Int']>,
  cursor?: Maybe<Scalars['Int']>,
  limit?: Maybe<Scalars['Int']>,
  page?: Maybe<Scalars['Int']>,
};

export type MediaNode = {
   __typename?: 'MediaNode',
  count: Scalars['Int'],
  rows: Array<Media>,
};

export enum MenuTypes {
  Category = 'category',
  Page = 'page'
}

export type Mutation = {
   __typename?: 'Mutation',
  register: AuthorResponse,
  login: LoginResponse,
  forgotPassword: ForgotPasswordResponse,
  resetPassword: ForgotPasswordResponse,
  updateAuthor?: Maybe<AuthorResponse>,
  createAuthor: CreateAuthorResponse,
  sendMail?: Maybe<Scalars['Boolean']>,
  insertMedia?: Maybe<Media>,
  deleteMedia?: Maybe<DeleteResponse>,
  updateMedia?: Maybe<UpdateResponse>,
  createPost: Response,
  updatePost: Response,
  deletePosts: Response,
  uploadFile: Response,
  updateOptions: Array<Setting>,
  updateTaxonomy: EditTaxResponse,
  deleteTaxonomy: EditTaxResponse,
  updateThemes: Scalars['Boolean'],
  insertThemes: Scalars['Boolean'],
};


export type MutationRegisterArgs = {
  username: Scalars['String'],
  password: Scalars['String'],
  email: Scalars['String']
};


export type MutationLoginArgs = {
  username?: Maybe<Scalars['String']>,
  email?: Maybe<Scalars['String']>,
  password: Scalars['String'],
  remember?: Maybe<Scalars['Boolean']>
};


export type MutationForgotPasswordArgs = {
  email: Scalars['String']
};


export type MutationResetPasswordArgs = {
  password: Scalars['String'],
  token: Scalars['String']
};


export type MutationUpdateAuthorArgs = {
  author: InputAuthor
};


export type MutationCreateAuthorArgs = {
  email: Scalars['String'],
  fname?: Maybe<Scalars['String']>,
  lname?: Maybe<Scalars['String']>,
  roleName?: Maybe<EnumRoles>
};


export type MutationSendMailArgs = {
  to: Scalars['String'],
  subject?: Maybe<Scalars['String']>,
  body?: Maybe<Scalars['String']>
};


export type MutationInsertMediaArgs = {
  url?: Maybe<Scalars['String']>
};


export type MutationDeleteMediaArgs = {
  ids: Array<Scalars['Int']>
};


export type MutationUpdateMediaArgs = {
  id: Scalars['Int'],
  name?: Maybe<Scalars['String']>,
  description?: Maybe<Scalars['String']>
};


export type MutationCreatePostArgs = {
  data?: Maybe<InputCreatePost>
};


export type MutationUpdatePostArgs = {
  data?: Maybe<InputUpdatePost>
};


export type MutationDeletePostsArgs = {
  ids?: Maybe<Array<Scalars['Int']>>,
  deleteFromSystem?: Maybe<Scalars['Boolean']>
};


export type MutationUploadFileArgs = {
  id?: Maybe<Scalars['Int']>,
  cover_image?: Maybe<Scalars['String']>
};


export type MutationUpdateOptionsArgs = {
  options?: Maybe<Array<Maybe<OptionInputType>>>
};


export type MutationUpdateTaxonomyArgs = {
  id: Scalars['Int'],
  name?: Maybe<Scalars['String']>,
  desc?: Maybe<Scalars['String']>,
  type: TaxonomyTypes,
  slug?: Maybe<Scalars['String']>
};


export type MutationDeleteTaxonomyArgs = {
  id: Scalars['Int']
};


export type MutationUpdateThemesArgs = {
  name: Scalars['String'],
  settings: Array<InputThemeSettings>
};


export type MutationInsertThemesArgs = {
  name: Scalars['String'],
  settings: Array<InputThemeSettings>
};

export type OptionInputType = {
  id?: Maybe<Scalars['Int']>,
  option?: Maybe<SettingOptions>,
  value?: Maybe<Scalars['String']>,
};

export type Permission = {
   __typename?: 'Permission',
  id: Scalars['Int'],
  name: Scalars['String'],
};

export type Post = {
   __typename?: 'Post',
  /** Primary key */
  id: Scalars['Int'],
  title: Scalars['String'],
  body: Scalars['String'],
  author: Author,
  excerpt: Scalars['String'],
  cover_image: Scalars['String'],
  type: Scalars['String'],
  status: Scalars['String'],
  slug: Scalars['String'],
  mode: Scalars['String'],
  createdAt: Scalars['Date'],
  publishedAt: Scalars['Date'],
  updatedAt: Scalars['Date'],
  taxonomies: Array<Taxonomy>,
};

export type PostFilters = {
  tag?: Maybe<Scalars['String']>,
  category?: Maybe<Scalars['String']>,
  authorName?: Maybe<Scalars['String']>,
  sortBy?: Maybe<PostSortBy>,
  status?: Maybe<PostStatusOptions>,
  author?: Maybe<Scalars['String']>,
  query?: Maybe<Scalars['String']>,
  type?: Maybe<PostTypes>,
  categorySlug?: Maybe<Scalars['String']>,
  tagSlug?: Maybe<Scalars['String']>,
  cursor?: Maybe<Scalars['Int']>,
  limit?: Maybe<Scalars['Int']>,
  page?: Maybe<Scalars['Int']>,
};

export type PostNode = {
   __typename?: 'PostNode',
  count: Scalars['Int'],
  rows: Array<Post>,
};

export enum PostSortBy {
  Newest = 'newest',
  Oldest = 'oldest'
}

export type PostStatus = {
   __typename?: 'PostStatus',
  published?: Maybe<Scalars['Int']>,
  drafts?: Maybe<Scalars['Int']>,
};

export enum PostStatusOptions {
  Publish = 'publish',
  Draft = 'draft',
  Trash = 'trash'
}

export type PostTaxonomyNode = {
   __typename?: 'PostTaxonomyNode',
  count?: Maybe<Scalars['Int']>,
  rows?: Maybe<Array<Maybe<Post>>>,
};

export enum PostTypes {
  Page = 'page',
  Post = 'post'
}

export type Query = {
   __typename?: 'Query',
  author: Author,
  authors: Array<Author>,
  me?: Maybe<Author>,
  validateToken?: Maybe<CreateAuthorResponse>,
  media: MediaNode,
  post: Post,
  posts: PostNode,
  adjacentPosts?: Maybe<AdjacentPosts>,
  search?: Maybe<SearchOutput>,
  stats?: Maybe<Stats>,
  roles: Array<Role>,
  settings: Array<Setting>,
  taxonomies: Array<Taxonomy>,
  activeTaxonomies: Array<Maybe<Taxonomy>>,
  themes: Array<Theme>,
};


export type QueryAuthorArgs = {
  id: Scalars['Int'],
  username?: Maybe<Scalars['String']>
};


export type QueryMediaArgs = {
  filters?: Maybe<MediaFiltersWithPagination>
};


export type QueryPostArgs = {
  filters?: Maybe<SinglePostFilters>
};


export type QueryPostsArgs = {
  filters?: Maybe<PostFilters>
};


export type QueryAdjacentPostsArgs = {
  slug?: Maybe<Scalars['String']>
};


export type QuerySearchArgs = {
  filters: SearchFilters
};


export type QuerySettingsArgs = {
  option?: Maybe<Scalars['String']>
};


export type QueryTaxonomiesArgs = {
  type?: Maybe<TaxonomyTypes>,
  name?: Maybe<Scalars['String']>
};


export type QueryActiveTaxonomiesArgs = {
  type?: Maybe<TaxonomyTypes>,
  postType?: Maybe<Scalars['String']>
};


export type QueryThemesArgs = {
  name?: Maybe<Scalars['String']>
};

export type Response = {
   __typename?: 'Response',
  ok: Scalars['Boolean'],
  post?: Maybe<Post>,
  errors?: Maybe<Array<Error>>,
};

export type Role = {
   __typename?: 'Role',
  id?: Maybe<Scalars['Int']>,
  name?: Maybe<EnumRoles>,
  permissions?: Maybe<Array<Maybe<Permission>>>,
};

export type SearchFilters = {
  query?: Maybe<Scalars['String']>,
  tag?: Maybe<Scalars['String']>,
  category?: Maybe<Scalars['String']>,
  cursor?: Maybe<Scalars['Int']>,
  page?: Maybe<Scalars['Int']>,
  limit?: Maybe<Scalars['String']>,
};

export type SearchOutput = {
   __typename?: 'SearchOutput',
  ok?: Maybe<Scalars['Boolean']>,
  count?: Maybe<Scalars['Int']>,
  rows?: Maybe<Array<Maybe<SearchResult>>>,
};

export type SearchResult = {
   __typename?: 'SearchResult',
  id?: Maybe<Scalars['Int']>,
  title?: Maybe<Scalars['String']>,
  excerpt?: Maybe<Scalars['String']>,
  publishedAt?: Maybe<Scalars['Date']>,
  slug?: Maybe<Scalars['String']>,
};

export type Setting = {
   __typename?: 'Setting',
  id: Scalars['Int'],
  option: SettingOptions,
  value: Scalars['String'],
};

export enum SettingOptions {
  SiteTitle = 'site_title',
  SiteTagline = 'site_tagline',
  SiteEmail = 'site_email',
  SiteUrl = 'site_url',
  SiteFooter = 'site_footer',
  SiteDescription = 'site_description',
  SocialTwitter = 'social_twitter',
  SocialFacebook = 'social_facebook',
  SocialInstagram = 'social_instagram',
  SocialGithub = 'social_github',
  TextNotfound = 'text_notfound',
  TextPostsEmpty = 'text_posts_empty',
  DisplayAuthorInfo = 'displayAuthorInfo',
  SiteLogo = 'site_logo',
  Menu = 'menu',
  Css = 'css',
  GoogleAnalytics = 'google_analytics',
  Locale = 'locale',
  Theme = 'theme',
  DisqusId = 'disqus_id',
  Banner = 'banner'
}

export type SinglePostFilters = {
  id?: Maybe<Scalars['Int']>,
  slug?: Maybe<Scalars['String']>,
};

export type Social = {
  github?: Maybe<Scalars['String']>,
  facebook?: Maybe<Scalars['String']>,
  twitter?: Maybe<Scalars['String']>,
  instagram?: Maybe<Scalars['String']>,
};

export type Stats = {
   __typename?: 'Stats',
  posts?: Maybe<PostStatus>,
  pages?: Maybe<PostStatus>,
  tags?: Maybe<Scalars['Int']>,
  categories?: Maybe<Scalars['Int']>,
};

export type Taxonomy = {
   __typename?: 'Taxonomy',
  id: Scalars['Int'],
  name: Scalars['String'],
  type: TaxonomyTypes,
  desc?: Maybe<Scalars['String']>,
  slug: Scalars['String'],
};

export type TaxonomyInputType = {
  id?: Maybe<Scalars['Int']>,
  name?: Maybe<Scalars['String']>,
  type?: Maybe<Scalars['String']>,
  slug?: Maybe<Scalars['String']>,
};

export enum TaxonomyTypes {
  PostTag = 'post_tag',
  PostCategory = 'post_category'
}

export type Theme = {
   __typename?: 'Theme',
  name: Scalars['String'],
  settings: Array<ThemeSettings>,
};

export type ThemeSettings = {
   __typename?: 'ThemeSettings',
  name: Scalars['String'],
  type: ThemeSettingsUiInputTypes,
  tag: ThemeSettingsUiTags,
  options?: Maybe<Array<Maybe<Scalars['String']>>>,
  placeholder?: Maybe<Scalars['String']>,
  defaultValue?: Maybe<Scalars['String']>,
  changedValue?: Maybe<Scalars['String']>,
  selectedValue?: Maybe<Scalars['String']>,
  label: Scalars['String'],
  helpText?: Maybe<Scalars['String']>,
};

export enum ThemeSettingsUiInputTypes {
  Radio = 'radio',
  Text = 'text',
  Checkbox = 'checkbox'
}

export enum ThemeSettingsUiTags {
  Input = 'input',
  Select = 'select'
}

export type TypeSocial = {
   __typename?: 'TypeSocial',
  github?: Maybe<Scalars['String']>,
  facebook?: Maybe<Scalars['String']>,
  twitter?: Maybe<Scalars['String']>,
  instagram?: Maybe<Scalars['String']>,
};

export type UpdateResponse = {
   __typename?: 'UpdateResponse',
  ok: Scalars['Boolean'],
  errors?: Maybe<Array<Maybe<Error>>>,
};

export type PostFieldsFragment = (
  { __typename?: 'Post' }
  & Pick<Post, 'id' | 'title' | 'body' | 'status' | 'createdAt' | 'publishedAt' | 'updatedAt' | 'excerpt' | 'cover_image' | 'slug' | 'mode' | 'type'>
  & { author: (
    { __typename?: 'Author' }
    & Pick<Author, 'fname' | 'lname' | 'avatar' | 'bio'>
  ), taxonomies: Array<(
    { __typename?: 'Taxonomy' }
    & Pick<Taxonomy, 'id' | 'name' | 'type' | 'slug'>
  )> }
);

export type CreatePostMutationVariables = {
  data?: Maybe<InputCreatePost>
};


export type CreatePostMutation = (
  { __typename?: 'Mutation' }
  & { createPost: (
    { __typename?: 'Response' }
    & Pick<Response, 'ok'>
    & { errors: Maybe<Array<(
      { __typename?: 'Error' }
      & Pick<Error, 'path' | 'message'>
    )>>, post: Maybe<(
      { __typename?: 'Post' }
      & Pick<Post, 'id' | 'title' | 'body' | 'status' | 'type' | 'slug' | 'mode' | 'excerpt' | 'createdAt' | 'cover_image'>
      & { author: (
        { __typename?: 'Author' }
        & Pick<Author, 'username'>
      ), taxonomies: Array<(
        { __typename?: 'Taxonomy' }
        & Pick<Taxonomy, 'id' | 'name' | 'type'>
      )> }
    )> }
  ) }
);

export type UpdateOptionsMutationVariables = {
  options?: Maybe<Array<Maybe<OptionInputType>>>
};


export type UpdateOptionsMutation = (
  { __typename?: 'Mutation' }
  & { updateOptions: Array<(
    { __typename?: 'Setting' }
    & Pick<Setting, 'id' | 'option' | 'value'>
  )> }
);

export type InsertThemesMutationVariables = {
  name: Scalars['String'],
  settings: Array<InputThemeSettings>
};


export type InsertThemesMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'insertThemes'>
);

export type UpdateThemesMutationVariables = {
  name: Scalars['String'],
  settings: Array<InputThemeSettings>
};


export type UpdateThemesMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'updateThemes'>
);

export type UpdateTaxonomyMutationVariables = {
  id: Scalars['Int'],
  name?: Maybe<Scalars['String']>,
  desc?: Maybe<Scalars['String']>,
  type: TaxonomyTypes,
  slug?: Maybe<Scalars['String']>
};


export type UpdateTaxonomyMutation = (
  { __typename?: 'Mutation' }
  & { updateTaxonomy: (
    { __typename?: 'EditTaxResponse' }
    & Pick<EditTaxResponse, 'id' | 'ok'>
    & { errors: Maybe<Array<(
      { __typename?: 'Error' }
      & Pick<Error, 'message' | 'path'>
    )>> }
  ) }
);

export type DeleteTaxonomyMutationVariables = {
  id: Scalars['Int']
};


export type DeleteTaxonomyMutation = (
  { __typename?: 'Mutation' }
  & { deleteTaxonomy: (
    { __typename?: 'EditTaxResponse' }
    & Pick<EditTaxResponse, 'id' | 'ok'>
    & { errors: Maybe<Array<(
      { __typename?: 'Error' }
      & Pick<Error, 'message' | 'path'>
    )>> }
  ) }
);

export type DeletePostsMutationVariables = {
  ids?: Maybe<Array<Scalars['Int']>>,
  deleteFromSystem?: Maybe<Scalars['Boolean']>
};


export type DeletePostsMutation = (
  { __typename?: 'Mutation' }
  & { deletePosts: (
    { __typename?: 'Response' }
    & Pick<Response, 'ok'>
  ) }
);

export type UpdateAuthorMutationVariables = {
  author: InputAuthor
};


export type UpdateAuthorMutation = (
  { __typename?: 'Mutation' }
  & { updateAuthor: Maybe<(
    { __typename?: 'AuthorResponse' }
    & Pick<AuthorResponse, 'ok'>
    & { errors: Maybe<Array<(
      { __typename?: 'Error' }
      & Pick<Error, 'path' | 'message'>
    )>> }
  )> }
);

export type CreateAuthorMutationVariables = {
  email: Scalars['String'],
  fname?: Maybe<Scalars['String']>,
  lname?: Maybe<Scalars['String']>,
  roleName?: Maybe<EnumRoles>
};


export type CreateAuthorMutation = (
  { __typename?: 'Mutation' }
  & { createAuthor: (
    { __typename?: 'CreateAuthorResponse' }
    & Pick<CreateAuthorResponse, 'ok'>
    & { errors: Maybe<Array<(
      { __typename?: 'Error' }
      & Pick<Error, 'path' | 'message'>
    )>> }
  ) }
);

export type UpdatePostMutationVariables = {
  data?: Maybe<InputUpdatePost>
};


export type UpdatePostMutation = (
  { __typename?: 'Mutation' }
  & { updatePost: (
    { __typename?: 'Response' }
    & Pick<Response, 'ok'>
    & { errors: Maybe<Array<(
      { __typename?: 'Error' }
      & Pick<Error, 'path' | 'message'>
    )>>, post: Maybe<(
      { __typename?: 'Post' }
      & Pick<Post, 'id' | 'title' | 'body' | 'slug' | 'type' | 'status' | 'excerpt' | 'mode' | 'createdAt' | 'cover_image'>
      & { author: (
        { __typename?: 'Author' }
        & Pick<Author, 'username' | 'lname' | 'fname' | 'avatar' | 'bio'>
      ), taxonomies: Array<(
        { __typename?: 'Taxonomy' }
        & Pick<Taxonomy, 'id' | 'name' | 'type' | 'slug'>
      )> }
    )> }
  ) }
);

export type InsertMediaMutationVariables = {
  url: Scalars['String']
};


export type InsertMediaMutation = (
  { __typename?: 'Mutation' }
  & { insertMedia: Maybe<(
    { __typename?: 'Media' }
    & Pick<Media, 'url' | 'id' | 'createdAt'>
  )> }
);

export type DeleteMediaMutationVariables = {
  ids: Array<Scalars['Int']>
};


export type DeleteMediaMutation = (
  { __typename?: 'Mutation' }
  & { deleteMedia: Maybe<(
    { __typename?: 'DeleteResponse' }
    & Pick<DeleteResponse, 'ok'>
  )> }
);

export type UploadFileMutationVariables = {
  cover_image: Scalars['String'],
  id: Scalars['Int']
};


export type UploadFileMutation = (
  { __typename?: 'Mutation' }
  & { uploadFile: (
    { __typename?: 'Response' }
    & Pick<Response, 'ok'>
    & { post: Maybe<(
      { __typename?: 'Post' }
      & Pick<Post, 'id' | 'cover_image'>
    )> }
  ) }
);

export type UpdateMediaMutationVariables = {
  id: Scalars['Int'],
  name?: Maybe<Scalars['String']>,
  description?: Maybe<Scalars['String']>
};


export type UpdateMediaMutation = (
  { __typename?: 'Mutation' }
  & { updateMedia: Maybe<(
    { __typename?: 'UpdateResponse' }
    & Pick<UpdateResponse, 'ok'>
    & { errors: Maybe<Array<Maybe<(
      { __typename?: 'Error' }
      & Pick<Error, 'message' | 'path'>
    )>>> }
  )> }
);

export type LoginMutationVariables = {
  username: Scalars['String'],
  password: Scalars['String']
};


export type LoginMutation = (
  { __typename?: 'Mutation' }
  & { login: (
    { __typename?: 'LoginResponse' }
    & Pick<LoginResponse, 'ok' | 'token'>
    & { errors: Maybe<Array<(
      { __typename?: 'Error' }
      & Pick<Error, 'message' | 'path'>
    )>> }
  ) }
);

export type ForgotPasswordMutationVariables = {
  email: Scalars['String']
};


export type ForgotPasswordMutation = (
  { __typename?: 'Mutation' }
  & { forgotPassword: (
    { __typename?: 'ForgotPasswordResponse' }
    & Pick<ForgotPasswordResponse, 'ok' | 'msg'>
  ) }
);

export type ResetPasswordMutationVariables = {
  token: Scalars['String'],
  password: Scalars['String']
};


export type ResetPasswordMutation = (
  { __typename?: 'Mutation' }
  & { resetPassword: (
    { __typename?: 'ForgotPasswordResponse' }
    & Pick<ForgotPasswordResponse, 'ok' | 'msg'>
  ) }
);

export type PostsQueryVariables = {
  filters?: Maybe<PostFilters>
};


export type PostsQuery = (
  { __typename?: 'Query' }
  & { posts: (
    { __typename?: 'PostNode' }
    & Pick<PostNode, 'count'>
    & { rows: Array<(
      { __typename?: 'Post' }
      & PostFieldsFragment
    )> }
  ) }
);

export type PostQueryVariables = {
  filters?: Maybe<SinglePostFilters>
};


export type PostQuery = (
  { __typename?: 'Query' }
  & { post: (
    { __typename?: 'Post' }
    & PostFieldsFragment
  ) }
);

export type MediaQueryVariables = {
  filters?: Maybe<MediaFiltersWithPagination>
};


export type MediaQuery = (
  { __typename?: 'Query' }
  & { media: (
    { __typename?: 'MediaNode' }
    & Pick<MediaNode, 'count'>
    & { rows: Array<(
      { __typename?: 'Media' }
      & Pick<Media, 'id' | 'url' | 'authorId' | 'createdAt' | 'name' | 'description'>
    )> }
  ) }
);

export type AuthorsQueryVariables = {};


export type AuthorsQuery = (
  { __typename?: 'Query' }
  & { authors: Array<(
    { __typename?: 'Author' }
    & Pick<Author, 'id' | 'email' | 'fname' | 'lname' | 'username' | 'avatar' | 'bio'>
    & { social: Maybe<(
      { __typename?: 'TypeSocial' }
      & Pick<TypeSocial, 'github' | 'facebook' | 'twitter' | 'instagram'>
    )>, role: Maybe<(
      { __typename?: 'Role' }
      & Pick<Role, 'name'>
      & { permissions: Maybe<Array<Maybe<(
        { __typename?: 'Permission' }
        & Pick<Permission, 'name'>
      )>>> }
    )> }
  )> }
);

export type AuthorQueryVariables = {
  id: Scalars['Int']
};


export type AuthorQuery = (
  { __typename?: 'Query' }
  & { author: (
    { __typename?: 'Author' }
    & Pick<Author, 'id' | 'username' | 'email' | 'fname' | 'lname' | 'avatar' | 'bio'>
    & { social: Maybe<(
      { __typename?: 'TypeSocial' }
      & Pick<TypeSocial, 'facebook' | 'instagram' | 'github' | 'twitter'>
    )>, role: Maybe<(
      { __typename?: 'Role' }
      & Pick<Role, 'name'>
      & { permissions: Maybe<Array<Maybe<(
        { __typename?: 'Permission' }
        & Pick<Permission, 'name'>
      )>>> }
    )> }
  ) }
);

export type RolesQueryVariables = {};


export type RolesQuery = (
  { __typename?: 'Query' }
  & { roles: Array<(
    { __typename?: 'Role' }
    & Pick<Role, 'id' | 'name'>
  )> }
);

export type SettingsQueryVariables = {};


export type SettingsQuery = (
  { __typename?: 'Query' }
  & { settings: Array<(
    { __typename?: 'Setting' }
    & Pick<Setting, 'id' | 'option' | 'value'>
  )> }
);

export type TaxonomiesQueryVariables = {
  type: TaxonomyTypes
};


export type TaxonomiesQuery = (
  { __typename?: 'Query' }
  & { taxonomies: Array<(
    { __typename?: 'Taxonomy' }
    & Pick<Taxonomy, 'id' | 'name' | 'desc' | 'slug' | 'type'>
  )> }
);

export type StatsQueryVariables = {};


export type StatsQuery = (
  { __typename?: 'Query' }
  & { stats: Maybe<(
    { __typename?: 'Stats' }
    & Pick<Stats, 'tags' | 'categories'>
    & { posts: Maybe<(
      { __typename?: 'PostStatus' }
      & Pick<PostStatus, 'published' | 'drafts'>
    )>, pages: Maybe<(
      { __typename?: 'PostStatus' }
      & Pick<PostStatus, 'published' | 'drafts'>
    )> }
  )> }
);

export type ThemesQueryVariables = {
  name?: Maybe<Scalars['String']>
};


export type ThemesQuery = (
  { __typename?: 'Query' }
  & { themes: Array<(
    { __typename?: 'Theme' }
    & Pick<Theme, 'name'>
    & { settings: Array<(
      { __typename?: 'ThemeSettings' }
      & Pick<ThemeSettings, 'name' | 'type' | 'tag' | 'defaultValue' | 'changedValue' | 'helpText' | 'label' | 'placeholder' | 'options'>
    )> }
  )> }
);

export type AdjacentPostsQueryVariables = {
  slug?: Maybe<Scalars['String']>
};


export type AdjacentPostsQuery = (
  { __typename?: 'Query' }
  & { adjacentPosts: Maybe<(
    { __typename?: 'AdjacentPosts' }
    & { next: Maybe<(
      { __typename?: 'Post' }
      & Pick<Post, 'title' | 'slug' | 'cover_image' | 'publishedAt'>
    )>, previous: Maybe<(
      { __typename?: 'Post' }
      & Pick<Post, 'title' | 'slug' | 'cover_image' | 'publishedAt'>
    )> }
  )> }
);

export type ValidateTokenQueryVariables = {};


export type ValidateTokenQuery = (
  { __typename?: 'Query' }
  & { validateToken: Maybe<(
    { __typename?: 'CreateAuthorResponse' }
    & Pick<CreateAuthorResponse, 'ok'>
    & { errors: Maybe<Array<(
      { __typename?: 'Error' }
      & Pick<Error, 'message'>
    )>> }
  )> }
);

export const PostFieldsFragmentDoc = gql`
    fragment postFields on Post {
  id
  title
  body
  status
  createdAt
  publishedAt
  updatedAt
  excerpt
  cover_image
  slug
  mode
  type
  author {
    fname
    lname
    avatar
    bio
  }
  taxonomies {
    id
    name
    type
    slug
  }
}
    `;
export const CreatePostDocument = gql`
    mutation createPost($data: InputCreatePost) {
  createPost(data: $data) {
    ok
    errors {
      path
      message
    }
    post {
      id
      title
      body
      author {
        username
      }
      status
      type
      slug
      mode
      excerpt
      createdAt
      cover_image
      taxonomies {
        id
        name
        type
      }
    }
  }
}
    `;
export type CreatePostMutationFn = ApolloReactCommon.MutationFunction<CreatePostMutation, CreatePostMutationVariables>;
export type CreatePostMutationResult = ApolloReactCommon.MutationResult<CreatePostMutation>;
export type CreatePostMutationOptions = ApolloReactCommon.BaseMutationOptions<CreatePostMutation, CreatePostMutationVariables>;
export const UpdateOptionsDocument = gql`
    mutation updateOptions($options: [OptionInputType]) {
  updateOptions(options: $options) {
    id
    option
    value
  }
}
    `;
export type UpdateOptionsMutationFn = ApolloReactCommon.MutationFunction<UpdateOptionsMutation, UpdateOptionsMutationVariables>;
export type UpdateOptionsMutationResult = ApolloReactCommon.MutationResult<UpdateOptionsMutation>;
export type UpdateOptionsMutationOptions = ApolloReactCommon.BaseMutationOptions<UpdateOptionsMutation, UpdateOptionsMutationVariables>;
export const InsertThemesDocument = gql`
    mutation insertThemes($name: String!, $settings: [InputThemeSettings!]!) {
  insertThemes(name: $name, settings: $settings)
}
    `;
export type InsertThemesMutationFn = ApolloReactCommon.MutationFunction<InsertThemesMutation, InsertThemesMutationVariables>;
export type InsertThemesMutationResult = ApolloReactCommon.MutationResult<InsertThemesMutation>;
export type InsertThemesMutationOptions = ApolloReactCommon.BaseMutationOptions<InsertThemesMutation, InsertThemesMutationVariables>;
export const UpdateThemesDocument = gql`
    mutation updateThemes($name: String!, $settings: [InputThemeSettings!]!) {
  updateThemes(name: $name, settings: $settings)
}
    `;
export type UpdateThemesMutationFn = ApolloReactCommon.MutationFunction<UpdateThemesMutation, UpdateThemesMutationVariables>;
export type UpdateThemesMutationResult = ApolloReactCommon.MutationResult<UpdateThemesMutation>;
export type UpdateThemesMutationOptions = ApolloReactCommon.BaseMutationOptions<UpdateThemesMutation, UpdateThemesMutationVariables>;
export const UpdateTaxonomyDocument = gql`
    mutation updateTaxonomy($id: Int!, $name: String, $desc: String, $type: TaxonomyTypes!, $slug: String) {
  updateTaxonomy(id: $id, name: $name, desc: $desc, type: $type, slug: $slug) {
    id
    ok
    errors {
      message
      path
    }
  }
}
    `;
export type UpdateTaxonomyMutationFn = ApolloReactCommon.MutationFunction<UpdateTaxonomyMutation, UpdateTaxonomyMutationVariables>;
export type UpdateTaxonomyMutationResult = ApolloReactCommon.MutationResult<UpdateTaxonomyMutation>;
export type UpdateTaxonomyMutationOptions = ApolloReactCommon.BaseMutationOptions<UpdateTaxonomyMutation, UpdateTaxonomyMutationVariables>;
export const DeleteTaxonomyDocument = gql`
    mutation deleteTaxonomy($id: Int!) {
  deleteTaxonomy(id: $id) {
    id
    ok
    errors {
      message
      path
    }
  }
}
    `;
export type DeleteTaxonomyMutationFn = ApolloReactCommon.MutationFunction<DeleteTaxonomyMutation, DeleteTaxonomyMutationVariables>;
export type DeleteTaxonomyMutationResult = ApolloReactCommon.MutationResult<DeleteTaxonomyMutation>;
export type DeleteTaxonomyMutationOptions = ApolloReactCommon.BaseMutationOptions<DeleteTaxonomyMutation, DeleteTaxonomyMutationVariables>;
export const DeletePostsDocument = gql`
    mutation deletePosts($ids: [Int!], $deleteFromSystem: Boolean) {
  deletePosts(ids: $ids, deleteFromSystem: $deleteFromSystem) {
    ok
  }
}
    `;
export type DeletePostsMutationFn = ApolloReactCommon.MutationFunction<DeletePostsMutation, DeletePostsMutationVariables>;
export type DeletePostsMutationResult = ApolloReactCommon.MutationResult<DeletePostsMutation>;
export type DeletePostsMutationOptions = ApolloReactCommon.BaseMutationOptions<DeletePostsMutation, DeletePostsMutationVariables>;
export const UpdateAuthorDocument = gql`
    mutation updateAuthor($author: InputAuthor!) {
  updateAuthor(author: $author) {
    ok
    errors {
      path
      message
    }
  }
}
    `;
export type UpdateAuthorMutationFn = ApolloReactCommon.MutationFunction<UpdateAuthorMutation, UpdateAuthorMutationVariables>;
export type UpdateAuthorMutationResult = ApolloReactCommon.MutationResult<UpdateAuthorMutation>;
export type UpdateAuthorMutationOptions = ApolloReactCommon.BaseMutationOptions<UpdateAuthorMutation, UpdateAuthorMutationVariables>;
export const CreateAuthorDocument = gql`
    mutation createAuthor($email: String!, $fname: String, $lname: String, $roleName: EnumRoles) {
  createAuthor(email: $email, fname: $fname, lname: $lname, roleName: $roleName) {
    ok
    errors {
      path
      message
    }
  }
}
    `;
export type CreateAuthorMutationFn = ApolloReactCommon.MutationFunction<CreateAuthorMutation, CreateAuthorMutationVariables>;
export type CreateAuthorMutationResult = ApolloReactCommon.MutationResult<CreateAuthorMutation>;
export type CreateAuthorMutationOptions = ApolloReactCommon.BaseMutationOptions<CreateAuthorMutation, CreateAuthorMutationVariables>;
export const UpdatePostDocument = gql`
    mutation updatePost($data: InputUpdatePost) {
  updatePost(data: $data) {
    ok
    errors {
      path
      message
    }
    post {
      id
      title
      body
      author {
        username
        lname
        fname
        avatar
        bio
      }
      slug
      type
      status
      excerpt
      mode
      createdAt
      cover_image
      taxonomies {
        id
        name
        type
        slug
      }
    }
  }
}
    `;
export type UpdatePostMutationFn = ApolloReactCommon.MutationFunction<UpdatePostMutation, UpdatePostMutationVariables>;
export type UpdatePostMutationResult = ApolloReactCommon.MutationResult<UpdatePostMutation>;
export type UpdatePostMutationOptions = ApolloReactCommon.BaseMutationOptions<UpdatePostMutation, UpdatePostMutationVariables>;
export const InsertMediaDocument = gql`
    mutation insertMedia($url: String!) {
  insertMedia(url: $url) {
    url
    id
    createdAt
  }
}
    `;
export type InsertMediaMutationFn = ApolloReactCommon.MutationFunction<InsertMediaMutation, InsertMediaMutationVariables>;
export type InsertMediaMutationResult = ApolloReactCommon.MutationResult<InsertMediaMutation>;
export type InsertMediaMutationOptions = ApolloReactCommon.BaseMutationOptions<InsertMediaMutation, InsertMediaMutationVariables>;
export const DeleteMediaDocument = gql`
    mutation deleteMedia($ids: [Int!]!) {
  deleteMedia(ids: $ids) {
    ok
  }
}
    `;
export type DeleteMediaMutationFn = ApolloReactCommon.MutationFunction<DeleteMediaMutation, DeleteMediaMutationVariables>;
export type DeleteMediaMutationResult = ApolloReactCommon.MutationResult<DeleteMediaMutation>;
export type DeleteMediaMutationOptions = ApolloReactCommon.BaseMutationOptions<DeleteMediaMutation, DeleteMediaMutationVariables>;
export const UploadFileDocument = gql`
    mutation uploadFile($cover_image: String!, $id: Int!) {
  uploadFile(cover_image: $cover_image, id: $id) {
    ok
    post {
      id
      cover_image
    }
  }
}
    `;
export type UploadFileMutationFn = ApolloReactCommon.MutationFunction<UploadFileMutation, UploadFileMutationVariables>;
export type UploadFileMutationResult = ApolloReactCommon.MutationResult<UploadFileMutation>;
export type UploadFileMutationOptions = ApolloReactCommon.BaseMutationOptions<UploadFileMutation, UploadFileMutationVariables>;
export const UpdateMediaDocument = gql`
    mutation updateMedia($id: Int!, $name: String, $description: String) {
  updateMedia(id: $id, name: $name, description: $description) {
    ok
    errors {
      message
      path
    }
  }
}
    `;
export type UpdateMediaMutationFn = ApolloReactCommon.MutationFunction<UpdateMediaMutation, UpdateMediaMutationVariables>;
export type UpdateMediaMutationResult = ApolloReactCommon.MutationResult<UpdateMediaMutation>;
export type UpdateMediaMutationOptions = ApolloReactCommon.BaseMutationOptions<UpdateMediaMutation, UpdateMediaMutationVariables>;
export const LoginDocument = gql`
    mutation login($username: String!, $password: String!) {
  login(email: $username, password: $password) {
    ok
    token
    errors {
      message
      path
    }
  }
}
    `;
export type LoginMutationFn = ApolloReactCommon.MutationFunction<LoginMutation, LoginMutationVariables>;
export type LoginMutationResult = ApolloReactCommon.MutationResult<LoginMutation>;
export type LoginMutationOptions = ApolloReactCommon.BaseMutationOptions<LoginMutation, LoginMutationVariables>;
export const ForgotPasswordDocument = gql`
    mutation forgotPassword($email: String!) {
  forgotPassword(email: $email) {
    ok
    msg
  }
}
    `;
export type ForgotPasswordMutationFn = ApolloReactCommon.MutationFunction<ForgotPasswordMutation, ForgotPasswordMutationVariables>;
export type ForgotPasswordMutationResult = ApolloReactCommon.MutationResult<ForgotPasswordMutation>;
export type ForgotPasswordMutationOptions = ApolloReactCommon.BaseMutationOptions<ForgotPasswordMutation, ForgotPasswordMutationVariables>;
export const ResetPasswordDocument = gql`
    mutation resetPassword($token: String!, $password: String!) {
  resetPassword(token: $token, password: $password) {
    ok
    msg
  }
}
    `;
export type ResetPasswordMutationFn = ApolloReactCommon.MutationFunction<ResetPasswordMutation, ResetPasswordMutationVariables>;
export type ResetPasswordMutationResult = ApolloReactCommon.MutationResult<ResetPasswordMutation>;
export type ResetPasswordMutationOptions = ApolloReactCommon.BaseMutationOptions<ResetPasswordMutation, ResetPasswordMutationVariables>;
export const PostsDocument = gql`
    query posts($filters: PostFilters) {
  posts(filters: $filters) {
    count
    rows {
      ...postFields
    }
  }
}
    ${PostFieldsFragmentDoc}`;
export type PostsQueryResult = ApolloReactCommon.QueryResult<PostsQuery, PostsQueryVariables>;
export const PostDocument = gql`
    query post($filters: SinglePostFilters) {
  post(filters: $filters) {
    ...postFields
  }
}
    ${PostFieldsFragmentDoc}`;
export type PostQueryResult = ApolloReactCommon.QueryResult<PostQuery, PostQueryVariables>;
export const MediaDocument = gql`
    query media($filters: MediaFiltersWithPagination) {
  media(filters: $filters) {
    count
    rows {
      id
      url
      authorId
      createdAt
      name
      description
    }
  }
}
    `;
export type MediaQueryResult = ApolloReactCommon.QueryResult<MediaQuery, MediaQueryVariables>;
export const AuthorsDocument = gql`
    query authors {
  authors {
    id
    email
    fname
    lname
    username
    avatar
    bio
    social {
      github
      facebook
      twitter
      instagram
    }
    role {
      name
      permissions {
        name
      }
    }
  }
}
    `;
export type AuthorsQueryResult = ApolloReactCommon.QueryResult<AuthorsQuery, AuthorsQueryVariables>;
export const AuthorDocument = gql`
    query author($id: Int!) {
  author(id: $id) {
    id
    username
    email
    fname
    lname
    social {
      facebook
      instagram
      github
      twitter
    }
    avatar
    bio
    role {
      name
      permissions {
        name
      }
    }
  }
}
    `;
export type AuthorQueryResult = ApolloReactCommon.QueryResult<AuthorQuery, AuthorQueryVariables>;
export const RolesDocument = gql`
    query roles {
  roles {
    id
    name
  }
}
    `;
export type RolesQueryResult = ApolloReactCommon.QueryResult<RolesQuery, RolesQueryVariables>;
export const SettingsDocument = gql`
    query settings {
  settings {
    id
    option
    value
  }
}
    `;
export type SettingsQueryResult = ApolloReactCommon.QueryResult<SettingsQuery, SettingsQueryVariables>;
export const TaxonomiesDocument = gql`
    query taxonomies($type: TaxonomyTypes!) {
  taxonomies(type: $type) {
    id
    name
    desc
    slug
    type
  }
}
    `;
export type TaxonomiesQueryResult = ApolloReactCommon.QueryResult<TaxonomiesQuery, TaxonomiesQueryVariables>;
export const StatsDocument = gql`
    query stats {
  stats {
    posts {
      published
      drafts
    }
    pages {
      published
      drafts
    }
    tags
    categories
  }
}
    `;
export type StatsQueryResult = ApolloReactCommon.QueryResult<StatsQuery, StatsQueryVariables>;
export const ThemesDocument = gql`
    query themes($name: String) {
  themes(name: $name) {
    name
    settings {
      name
      type
      tag
      defaultValue
      changedValue
      helpText
      label
      placeholder
      options
    }
  }
}
    `;
export type ThemesQueryResult = ApolloReactCommon.QueryResult<ThemesQuery, ThemesQueryVariables>;
export const AdjacentPostsDocument = gql`
    query adjacentPosts($slug: String) {
  adjacentPosts(slug: $slug) {
    next {
      title
      slug
      cover_image
      publishedAt
    }
    previous {
      title
      slug
      cover_image
      publishedAt
    }
  }
}
    `;
export type AdjacentPostsQueryResult = ApolloReactCommon.QueryResult<AdjacentPostsQuery, AdjacentPostsQueryVariables>;
export const ValidateTokenDocument = gql`
    query validateToken {
  validateToken {
    ok
    errors {
      message
    }
  }
}
    `;
export type ValidateTokenQueryResult = ApolloReactCommon.QueryResult<ValidateTokenQuery, ValidateTokenQueryVariables>;