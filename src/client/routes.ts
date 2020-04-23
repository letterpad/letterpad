import * as helperProps from "./helperProps";

import { EnumContentType } from "./types";
import { IRoutes } from "./App";
import LayoutConnector from "./LayoutConnector";
import { NavigationType } from "../__generated__/gqlTypes";
import { RouteProps } from "react-router";
import apolloClient from "../shared/apolloClient";
import config from "../config";

interface IRouteProps extends RouteProps {
  component: RouteProps["component"] & {
    getInitialProps?: ({ match, req, res, client }: any) => Promise<any>;
  };
  exact: boolean;
  path: string | string[];
}

const getRoutes = (args: IRoutes["initialData"]): IRouteProps[] => {
  const settings = args.settings;
  const { themeSettings } = args;
  const home = settings.menu[0];
  let theme = "";

  if (config.NODE_ENV === "dev") {
    theme = `${config.THEME}`;
  } else {
    theme = `${settings.theme}`;
  }
  let Theme = require(`./themes/${theme}/app`).default;
  let { Home, Posts, Layout, Page, Post, NotFound, Search } = Theme;
  const isAdmin = false;
  const commonProps = {
    client: apolloClient(isAdmin),
    settings,
    themeSettings,
    initialProps: args.initialProps,
    helpers: { ...helperProps },
  };
  const routes: IRouteProps[] = [
    {
      exact: true,
      component: LayoutConnector(
        Home,
        {
          contentType:
            home.type === NavigationType.Tag
              ? EnumContentType.POSTS
              : EnumContentType.PAGE,
          ...commonProps,
        },
        Layout,
      ),
      path: ["/", "/dev/", "/home/page/:page_no"],
    },
    {
      exact: true,
      component: LayoutConnector(
        Posts,
        {
          contentType: EnumContentType.POSTS,
          ...commonProps,
        },
        Layout,
      ),
      path: ["/posts/:tag", "/tag/:tag"],
    },
    {
      exact: true,
      component: LayoutConnector(
        Post,
        {
          contentType: EnumContentType.POST,
          ...commonProps,
        },
        Layout,
      ),
      path: ["/preview/post/:previewHash"],
    },
    {
      exact: true,
      component: LayoutConnector(
        Post,
        {
          contentType: EnumContentType.PAGE,
          ...commonProps,
        },
        Layout,
      ),
      path: ["/preview/page/:previewHash"],
    },
    {
      exact: true,
      component: LayoutConnector(
        Page,
        {
          contentType: EnumContentType.PAGE,
          ...commonProps,
        },
        Layout,
      ),
      path: ["/page/:slug"],
    },
    {
      exact: true,
      component: LayoutConnector(
        Post,
        {
          contentType: EnumContentType.POST,
          ...commonProps,
        },
        Layout,
      ),
      path: ["/post/:slug"],
    },
    {
      exact: true,
      component: LayoutConnector(
        Search,
        {
          contentType: EnumContentType.TAG,
          ...commonProps,
        },
        Layout,
      ),
      path: ["/tag/:query"],
    },
    {
      exact: true,
      component: LayoutConnector(
        Search,
        {
          contentType: EnumContentType.TAG,
          ...commonProps,
        },
        Layout,
      ),
      path: ["/search/"],
    },
    {
      exact: true,
      component: LayoutConnector(
        NotFound,
        {
          contentType: EnumContentType.PAGE,
          ...commonProps,
        },
        Layout,
      ),
      path: "*",
    },
  ];
  return routes;
};

export default getRoutes;
