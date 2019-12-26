import ApolloClient from "apollo-client";
import { RouteComponentProps } from "react-router";
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

export interface IThemeComponentProps extends IRouteProps {
  router: RouteComponentProps;
}

export interface IWrappedComponentProps extends IRouteProps {
  refetch: () => void;
  isLoading: boolean;
}

export type TypeWrappedComponent = React.ComponentType<
  IWrappedComponentProps
> & {
  getInitialProps?: ({ match, req, res, client }: any) => Promise<any>;
};
