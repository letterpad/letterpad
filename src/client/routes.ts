import { EnumContentType, TypeSettings } from "./types";

import Home from "./containers/Home";
import { IRoutes } from "./ClientApp";
import LayoutConnector from "./LayoutConnector";
import NotFound from "./containers/NotFound";
import Posts from "./containers/Posts";
import { RouteProps } from "react-router";
import Search from "./containers/Search";
import SinglePage from "./containers/SinglePage";
import SinglePost from "./containers/SinglePost";
import apolloClient from "../shared/apolloClient";

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
      component: LayoutConnector(Home, {
        contentType:
          home.type === "category"
            ? EnumContentType.POSTS
            : EnumContentType.PAGE,
        ...commonProps,
      }),
      path: ["/", "/home/page/:page_no"],
    },
    {
      exact: true,
      component: LayoutConnector(Posts, {
        contentType: EnumContentType.PAGE,
        ...commonProps,
      }),
      path: ["/posts/:category", "/category/:category", "/tag/:tag"],
    },
    {
      exact: true,
      component: LayoutConnector(SinglePage, {
        contentType: EnumContentType.PAGE,
        ...commonProps,
      }),
      path: ["/page/:slug"],
    },
    {
      exact: true,
      component: LayoutConnector(SinglePost, {
        contentType: EnumContentType.POST,
        ...commonProps,
      }),
      path: ["/post/:slug"],
    },
    {
      exact: true,
      component: LayoutConnector(Search, {
        contentType: EnumContentType.CATEGORY,
        ...commonProps,
      }),
      path: ["/category/:query", "/tag/:query"],
    },
    {
      exact: true,
      component: LayoutConnector(Search, {
        contentType: EnumContentType.CATEGORY,
        ...commonProps,
      }),
      path: ["/search/"],
    },
    {
      exact: true,
      component: LayoutConnector(NotFound, {
        contentType: EnumContentType.PAGE,
        ...commonProps,
      }),
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
