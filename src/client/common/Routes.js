import React, { Component } from "react";
import PropTypes from "prop-types";
// import { withRouter } from "react-router";
import { Route, Switch } from "react-router-dom";
import SEO from "../helpers/SEO";
import Loader from "../helpers/Loader";
import { hot } from "react-hot-loader";
// Data supply
import SettingsData from "../../shared/data-connectors/SettingsData";
import ThemeSettingsData from "../../shared/data-connectors/ThemeSettingsData";
/*!------------------------------------------------------------------
[View Containers-]
*/
import Home from "../containers/Home";
import Posts from "../containers/Posts";
import SinglePage from "../containers/SinglePage";
import SinglePost from "../containers/SinglePost";
import SearchWrapper from "../containers/SearchWrapper";
import Layout from "../containers/Layout";
import NotFound from "../containers/404";
import DecorateRoute from "./DecorateRoute";

class Routes extends Component {
  applyCustomCSS = ({ css }) => {
    if (typeof document == "undefined" || typeof css == "undefined")
      return false;
    const style = document.createElement("style");
    style.setAttribute("type", "text/css");
    style.innerText = css.value;
    document.head.appendChild(style);
  };

  getHomeSlug = () => {
    // To get the homepage, parse the menu settings then take the first item as the home
    const menu = JSON.parse(this.props.settings.data.menu.value);
    let home = menu[0];
    return home;
  };

  render() {
    if (this.props.settings.loading) {
      return <Loader />;
    }

    const settings = {
      ...this.props.settings.data,
      themeConfig: this.props.themeSettings,
    };

    this.applyCustomCSS(settings);
    const home = this.getHomeSlug();

    const getComponent = (Comp, type) => {
      return DecorateRoute(Layout(Comp), { settings, type });
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

Routes.propTypes = {
  settings: PropTypes.object,
  themeSettings: PropTypes.object,
  history: PropTypes.object,
};
export default hot(module)(ThemeSettingsData(SettingsData(Routes)));
