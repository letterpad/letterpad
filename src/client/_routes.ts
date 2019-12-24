import { IRoutes } from "./Routes";
import Home from "./containers/Home";
import Posts from "./containers/Posts";
import SinglePage from "./containers/SinglePage";
import SinglePost from "./containers/SinglePost";
import SearchWrapper from "./containers/SearchWrapper";
import NotFound from "./containers/404";
import Renderer from "./Renderer";
import apolloClient from "../shared/apolloClient";
import { ThemeSettings } from "../__generated__/gqlTypes";
import { TypeSettings } from "./types";
import { RouteProps } from "react-router";
import withSSR from "./withSSR";

const getRoutes = (args: IRoutes["initialData"]): RouteProps[] => {
  const settings = args.settings as TypeSettings;
  const { themeSettings } = args;
  const home = getHomeSlug(settings);
  if (typeof window !== "undefined") {
    // @ts-ignore: test s
    window.a = Renderer(withSSR(Home), {
      type: home.type === "category" ? "posts" : "page",
      client: apolloClient(),
      settings,
      themeSettings,
    });
  }

  const routes = [
    {
      exact: true,
      component: Renderer(withSSR(Home), {
        type: home.type === "category" ? "posts" : "page",
        client: apolloClient(),
        settings,
        themeSettings,
        data: args.data,
      }),
      path: ["/", "/home/page/:page_no"],
    },
    {
      exact: true,
      component: Renderer(withSSR(Posts), {
        type: "page",
        client: apolloClient(),
        settings,
        themeSettings,
      }),
      path: ["/posts/:slug", "/posts/:slug/page/:page_no"],
    },
    {
      exact: true,
      component: Renderer(withSSR(SinglePage), {
        type: "page",
        client: apolloClient(),
        settings,
        themeSettings,
      }),
      path: ["/page/:slug"],
    },
    {
      exact: true,
      component: Renderer(withSSR(SinglePost), {
        type: "post",
        client: apolloClient(),
        settings,
        themeSettings,
      }),
      path: ["/post/:slug"],
    },
    {
      exact: true,
      component: Renderer(withSSR(SearchWrapper), {
        type: "category",
        client: apolloClient(),
        settings,
        themeSettings,
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
      component: Renderer(withSSR(NotFound), {
        type: "page",
        client: apolloClient(),
        settings,
        themeSettings,
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

const getComponent = (
  WrappedComponent: React.ComponentType<any>,
  type: string,
  settings: TypeSettings,
  themeSettings: ThemeSettings[],
) => {
  const LayoutWithProps = Renderer(WrappedComponent, {
    settings,
    type,
    client: apolloClient(),
    themeSettings,
  });

  return LayoutWithProps;
};
