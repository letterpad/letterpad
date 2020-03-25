import {
  MenuTypes,
  Post,
  PostsNode,
  Setting,
  SettingOptions,
  ThemeSettings,
} from "../__generated__/gqlTypes";

import ApolloClient from "apollo-client";
import { IHelpers } from "./helperProps";
import { RouteComponentProps } from "react-router";

export type TypeSettings = { [option in SettingOptions]: Setting };

export interface IMenu {
  id: number;
  title: string;
  slug: string;
  type: MenuTypes | string;
}

export enum EnumContentType {
  POSTS = "posts",
  POST = "post",
  PAGE = "page",
  CATEGORY = "category",
  TAG = "tag",
}

export interface IRouteProps<T> {
  contentType: EnumContentType;
  settings: TypeSettings;
  client: ApolloClient<any>;
  themeSettings: ThemeSettings[];
  initialProps?: any;
  loading?: boolean;
  data?: T | undefined;
  helpers: IHelpers;
}

export interface RouteParams {
  slug?: string;
  category?: string;
  tag?: string;
  page_no?: string;
  query?: string;
}
export interface IThemeComponentProps<T> extends IRouteProps<T> {
  router: RouteComponentProps<RouteParams>;
}

export interface IServerRenderProps {
  requestUrl: string;
  client: ApolloClient<any>;
  settings: TypeSettings;
  isStatic: boolean;
  themeSettings: ThemeSettings[];
  request: { req: Express.Request; res: Express.Response };
}

export interface ILayoutProps extends IRouteProps<IThemeContainer> {
  router: RouteComponentProps;
  Content: React.ComponentType<IThemeComponentProps<IThemeContainer>>;
}

export interface IInitialProps {
  match: RouteComponentProps<RouteParams>["match"];
  client: ApolloClient<any>;
}
type TypeInitialProps = {
  getInitialProps?: ({ match, client }: IInitialProps) => Promise<any>;
};

type TypeThemePost = React.ComponentType<IThemeComponentProps<Post>> &
  TypeInitialProps;

type TypeThemePosts = React.ComponentType<IThemeComponentProps<PostsNode>> &
  TypeInitialProps;

type TypeThemeHome = React.ComponentType<
  IThemeComponentProps<Post & PostsNode>
> &
  TypeInitialProps;

export type IThemeContainer = {
  Post: TypeThemePost;
  Page: TypeThemePost;
  Posts: TypeThemePosts;
  Home: TypeThemeHome;
};

interface IImageAttrs {
  src: string;
  sizes: string;
  "data-srcset": string;
  srcset: string[];
  width: string;
  loading: "lazy";
}
export type IImageAttrsResult = IImageAttrs | {};
