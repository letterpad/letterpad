import ApolloClient from "apollo-client";
import { RouteComponentProps, RouterProps } from "react-router";
import {
  SettingOptions,
  Setting,
  ThemeSettings,
} from "../__generated__/gqlTypes";

export type TypeSettings = { [option in SettingOptions]: Setting };

export enum EnumContentType {
  POSTS = "posts",
  POST = "post",
  PAGE = "page",
  CATEGORY = "category",
  TAG = "tag",
}

export interface IRouteProps {
  contentType: EnumContentType;
  settings: TypeSettings;
  client: ApolloClient<any>;
  themeSettings: ThemeSettings[];
  initialProps?: any;
}

export interface RouteParams {
  slug?: string;
  category?: string;
  tag?: string;
  page_no?: string;
  query?: string;
}
export interface IThemeComponentProps extends IRouteProps {
  router: RouteComponentProps<RouteParams>;
}

export interface IServerRenderProps {
  requestUrl: string;
  client: ApolloClient<any>;
  settings: TypeSettings;
  isStatic: boolean;
  request: { req: Express.Request; res: Express.Response };
}

export interface ILayoutProps extends IRouteProps {
  router: RouteComponentProps;
  Content: React.ComponentType<IThemeComponentProps>;
}

export interface IInitialProps {
  match: RouteComponentProps<RouteParams>["match"];
  client: ApolloClient<any>;
}

export type IThemeContainer = React.ComponentType<IThemeComponentProps> & {
  getInitialProps?: ({ match, client }: IInitialProps) => Promise<any>;
};
