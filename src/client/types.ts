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
  data?: any;
  Renderer: React.ComponentType<T>;
}

export interface IRouteProps {
  type: string;
  settings: TypeSettings;
  client: ApolloClient<any>;
  themeSettings: ThemeSettings[];
  data?: any;
}

export interface IThemeComponentProps extends IRouteProps {
  router: RouteComponentProps;
}
