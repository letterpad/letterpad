import { IRoutes } from "./ClientApp";
import Home from "./containers/Home";
import Posts from "./containers/Posts";
import SinglePage from "./containers/SinglePage";
import SinglePost from "./containers/SinglePost";
import SearchWrapper from "./containers/SearchWrapper";
import NotFound from "./containers/404";
import LayoutConnector from "./LayoutConnector";
import apolloClient from "../shared/apolloClient";
import { TypeSettings } from "./types";
import { RouteProps } from "react-router";

interface IRouteProps extends RouteProps {
  component: RouteProps["component"] & {
    getInitialProps?: ({ match, req, res, client }: any) => Promise<any>;
  };
}

const getRoutes = (args: IRoutes["initialData"]): IRouteProps[] => {
  const settings = args.settings as TypeSettings;
  const { themeSettings } = args;
  const home = getHomeSlug(settings);

  const commonProps = {
    client: apolloClient(),
    settings,
    themeSettings,
    initialProps: args.initialProps,
  };
  const routes: IRouteProps[] = [
    {
      exact: true,
      component: LayoutConnector(Home, {
        type: home.type === "category" ? "posts" : "page",
        ...commonProps,
      }),
      path: ["/", "/home/page/:page_no"],
    },
    {
      exact: true,
      component: LayoutConnector(Posts, {
        type: "page",
        ...commonProps,
      }),
      path: ["/posts/:slug", "/posts/:slug/page/:page_no"],
    },
    {
      exact: true,
      component: LayoutConnector(SinglePage, {
        type: "page",
        ...commonProps,
      }),
      path: ["/page/:slug"],
    },
    {
      exact: true,
      component: LayoutConnector(SinglePost, {
        type: "post",
        ...commonProps,
      }),
      path: ["/post/:slug"],
    },
    {
      exact: true,
      component: LayoutConnector(SearchWrapper, {
        type: "category",
        ...commonProps,
      }),
      path: [
        "/category/:query",
        "/category/:query/page/:page_no",
        "/tag/:query",
        "/tag/:query/page/:page_no",
        "/search/:query?",
      ],
    },
    {
      exact: true,
      component: LayoutConnector(NotFound, {
        type: "page",
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
