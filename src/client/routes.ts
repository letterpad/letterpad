import { EnumContentType, TypeSettings } from "./types";

import { IRoutes } from "./ClientApp";
import LayoutConnector from "./LayoutConnector";
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
  const settings = args.settings as TypeSettings;
  const { themeSettings } = args;
  const home = getHomeSlug(settings);
  let theme = "";

  if (config.NODE_ENV === "dev") {
    theme = `${config.THEME}`;
  } else {
    theme = `${settings.theme.value}`;
  }
  let Theme = require(`./themes/${theme}/app`).default;
  let { Home, Posts, Layout, Page, Post, NotFound, Search } = Theme;
  const isAdmin = false;
  const commonProps = {
    client: apolloClient(isAdmin),
    settings,
    themeSettings,
    initialProps: args.initialProps,
  };
  const routes: IRouteProps[] = [
    {
      exact: true,
      component: LayoutConnector(
        Home,
        {
          contentType:
            home.type === "category"
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
          contentType: EnumContentType.PAGE,
          ...commonProps,
        },
        Layout,
      ),
      path: ["/posts/:category", "/category/:category", "/tag/:tag"],
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
          contentType: EnumContentType.CATEGORY,
          ...commonProps,
        },
        Layout,
      ),
      path: ["/category/:query", "/tag/:query"],
    },
    {
      exact: true,
      component: LayoutConnector(
        Search,
        {
          contentType: EnumContentType.CATEGORY,
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

const getHomeSlug = (settings: TypeSettings) => {
  const menu = JSON.parse(settings.menu.value);
  // To get the homepage, parse the menu settings then take the first item as the home
  let home = menu[0];
  return home;
};
