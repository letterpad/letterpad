import ApolloClient from "apollo-client";
import { RouteComponentProps, RouterProps } from "react-router";
import {
  SettingOptions,
  Setting,
  ThemeSettings,
} from "../__generated__/gqlTypes";

export type TypeSettings = { [option in SettingOptions]: Setting };

export interface IServerRenderProps {
  requestUrl: string;
  client: ApolloClient<any>;
  settings: TypeSettings;
  isStatic: boolean;
  request: { req: Express.Request; res: Express.Response };
}

export interface ILayoutProps<T> {
  type: string;
  settings: TypeSettings;
  client: ApolloClient<any>;
  router: RouteComponentProps;
  initialProps?: any;
  themeSettings: ThemeSettings[];
  Renderer: React.ComponentType<T>;
}

export interface IRouteProps {
  type: string;
  settings: TypeSettings;
  client: ApolloClient<any>;
  themeSettings: ThemeSettings[];
  initialProps?: any;
}

export interface RouteParams {
  slug?: string;
  page_no?: string;
  query?: string;
}
export interface IThemeComponentProps extends IRouteProps {
  router: RouteComponentProps<RouteParams>;
}

export interface IInitialProps {
  match: RouteComponentProps["match"];
  client: ApolloClient<any>;
}

export type IThemeContainer = React.FC<IThemeComponentProps> & {
  getInitialProps?: ({
    match,

    client,
  }: IInitialProps) => Promise<any>;
};

export interface IWrappedComponentProps extends IRouteProps {
  refetch: () => void;
  isLoading: boolean;
}

export type TypeWrappedComponent = React.ComponentType<
  IWrappedComponentProps
> & {
  getInitialProps?: ({ match, req, res, client }: any) => Promise<any>;
};
