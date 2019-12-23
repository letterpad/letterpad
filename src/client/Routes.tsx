import React, { Component } from "react";
import { Route, Switch } from "react-router-dom";
import SEO from "./helpers/SEO";
import { hot } from "react-hot-loader";

/*!------------------------------------------------------------------
[View Containers-]
*/
import Home from "./containers/Home";
import Posts from "./containers/Posts";
import SinglePage from "./containers/SinglePage";
import SinglePost from "./containers/SinglePost";
import SearchWrapper from "./containers/SearchWrapper";
import NotFound from "./containers/404";
import Renderer from "./Renderer";
import {
  SettingOptions,
  Setting,
  ThemeSettings,
} from "../__generated__/gqlTypes";
import apolloClient from "../shared/apolloClient";

export type TypeSettings = { [option in SettingOptions]: Setting };

interface IRoutes {
  initialData: {
    settings: TypeSettings | {};
    themeConfig: ThemeSettings[] | [];
  };
}

class Routes extends Component<IRoutes, {}> {
  applyCustomCSS = ({ css }) => {
    if (typeof document == "undefined" || typeof css == "undefined")
      return false;
    const style = document.createElement("style");
    style.setAttribute("type", "text/css");
    style.innerText = css.value;
    document.head.appendChild(style);
  };

  getHomeSlug = () => {
    const menu = JSON.parse(
      (this.props.initialData.settings as TypeSettings).menu.value,
    );

    // To get the homepage, parse the menu settings then take the first item as the home
    // const menu = JSON.parse(menuStr);
    let home = menu[0];
    return home;
  };

  render() {
    const settings = this.props.initialData.settings as TypeSettings;

    this.applyCustomCSS(settings);
    const home = this.getHomeSlug();

    const getComponent = (
      WrappedComponent: React.ComponentType<any>,
      type: string,
    ) => {
      const LayoutWithProps = Renderer(WrappedComponent, {
        settings,
        type,
        client: apolloClient(),
        themeConfig: (this.props.initialData
          .themeConfig as unknown) as ThemeSettings[],
      });

      return LayoutWithProps;
    };

    const routes = [
      {
        exact: true,
        component: getComponent(
          Home,
          home.type === "category" ? "posts" : "page",
        ),
        path: ["/", "/home/page/:page_no"],
      },
      {
        exact: true,
        component: getComponent(Posts, "posts"),
        path: ["/posts/:slug", "/posts/:slug/page/:page_no"],
      },
      {
        exact: true,
        component: getComponent(SinglePage, "page"),
        path: ["/page/:slug"],
      },
      {
        exact: true,
        component: getComponent(SinglePost, "post"),
        path: ["/post/:slug"],
      },
      {
        exact: true,
        component: getComponent(SearchWrapper, "category"),
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
        component: getComponent(NotFound, "page"),
        path: "*",
      },
    ];

    return (
      <div>
        <SEO
          schema="Blog"
          title={`${settings.site_title.value} | ${settings.site_tagline.value}`}
          description={settings.site_description.value}
          path="/"
          image="/"
          contentType="blog"
          settings={settings}
        />
        <Switch>
          {routes.map((route, i) => (
            <Route
              key={i}
              exact
              path={route.path}
              component={route.component}
            />
          ))}
        </Switch>
      </div>
    );
  }
}

export default hot(module)(Routes);
