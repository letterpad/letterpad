import React, { Component } from "react";
import PropTypes from "prop-types";
import { Route, Switch } from "react-router-dom";
import { withRouter } from "react-router";
import SEO from "./helpers/SEO";
import Loader from "./helpers/Loader";
import config from "../config";
import { hot, setConfig } from "react-hot-loader";
// Data supply
import SettingsData from "../shared/data-connectors/SettingsData";
import ThemeSettingsData from "../shared/data-connectors/ThemeSettingsData";

/*!------------------------------------------------------------------
[View Containers-]
*/
import Home from "./containers/Home";
import Posts from "./containers/Posts";
import SinglePage from "./containers/SinglePage";
import SinglePost from "./containers/SinglePost";
import SearchWrapper from "./containers/SearchWrapper";
import Layout from "./containers/Layout";
import NotFound from "./containers/404";

class Routes extends Component {
  componentDidUpdate(prevProps) {
    if (this.props.location !== prevProps.location) {
      if (this.props.settings.data.google_analytics.value) {
        ga("set", "page", config.baseName + this.props.location.pathname);
        ga("send", "pageview");
      }
    }
  }

  applyCustomCSS = ({ css }) => {
    if (typeof document == "undefined" || typeof css == "undefined")
      return false;
    const style = document.createElement("style");
    style.setAttribute("type", "text/css");
    style.innerText = css.value;
    document.head.appendChild(style);
  };

  getHomeSlug = () => {
    // To get the homepage, parse the menu settings and see if there is any label by the name Home.
    // If not, then take the first item as the home
    const menu = JSON.parse(this.props.settings.data.menu.value);
    let home = menu.filter(item => item.name === "Home");
    if (home.length === 0) {
      home = menu[0];
    } else {
      home = home[0];
    }
    if (home.type === "label") {
      home = home.children[0];
    }
    return home;
  };

  render() {
    if (this.props.settings.loading || this.props.themeSettingsLoading) {
      return <Loader />;
    }

    const settings = {
      ...this.props.settings.data,
      themeConfig: this.props.themeSettings,
    };

    this.applyCustomCSS(settings);
    const home = this.getHomeSlug();

    const routes = [
      {
        exact: true,
        component: Layout(
          Home,
          { settings, slug: home.slug, type: home.type },
          "Home",
        ),
        path: "/",
      },
      {
        exact: true,
        component: Layout(
          Home,
          { settings, slug: home.slug, type: home.type },
          "Home",
        ),
        path: "/home/page/:page_no",
      },
      {
        exact: true,
        component: Layout(Posts, { settings, type: "posts" }),
        path: "/posts/:slug",
      },
      {
        exact: true,
        component: Layout(Posts, { settings, type: "posts" }),
        path: "/posts/:slug/page/:page_no",
      },
      {
        exact: true,
        component: Layout(SinglePage, {
          type: "page",
          settings,
        }),
        path: "/page/:slug",
      },
      {
        exact: true,
        component: Layout(SinglePost, {
          type: "post",
          settings,
        }),
        path: "/post/:slug",
      },
      {
        exact: true,
        component: Layout(SearchWrapper, {
          type: "category",
          settings,
        }),
        path: "/category/:query",
      },
      {
        exact: true,
        component: Layout(SearchWrapper, {
          type: "category",
          settings,
        }),
        path: "/category/:query/page/:page_no",
      },
      {
        exact: true,
        component: Layout(SearchWrapper, {
          type: "tag",
          settings,
        }),
        path: "/tag/:query",
      },
      {
        exact: true,
        component: Layout(SearchWrapper, {
          type: "tag",
          settings,
        }),
        path: "/tag/:query/page/:page_no",
      },
      {
        exact: true,
        component: Layout(SearchWrapper, {
          type: "post",
          settings,
        }),
        path: "/search/:query?",
      },
    ];

    return (
      <div>
        <SEO
          schema="Blog"
          title={`${settings.site_title.value} | ${
            settings.site_tagline.value
          }`}
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
          <Route
            path="*"
            component={Layout(
              NotFound,
              {
                settings,
              },
              "NotFound",
            )}
          />
        </Switch>
      </div>
    );
  }
}
setConfig({ logLevel: "error" });

Routes.propTypes = {
  location: PropTypes.object,
  settings: PropTypes.object,
  themeSettings: PropTypes.object,
  themeSettingsLoading: PropTypes.bool,
};
export default hot(module)(SettingsData(ThemeSettingsData(withRouter(Routes))));
