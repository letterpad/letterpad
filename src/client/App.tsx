import React, { Component } from "react";
import { Route, Switch } from "react-router-dom";
import { Setting, ThemeSettings } from "../__generated__/gqlTypes";

import SEO from "./helpers/SEO";
import getRoutes from "./routes";

export interface IRoutes {
  initialData: {
    settings: Setting;
    themeSettings: ThemeSettings[] | [];
    initialProps?: {} | null;
  };
}

export default class App extends Component<IRoutes, {}> {
  applyCustomCSS = ({ css }) => {
    if (typeof document == "undefined" || typeof css == "undefined")
      return false;
    const style = document.createElement("style");
    style.setAttribute("type", "text/css");
    style.innerText = css.value;
    document.head.appendChild(style);
  };

  render() {
    const settings = this.props.initialData.settings;
    this.applyCustomCSS(settings);
    const routes = getRoutes({ ...this.props.initialData });
    return (
      <>
        <SEO
          schema="Blog"
          title={`${settings.site_title} | ${settings.site_tagline}`}
          description={settings.site_description}
          path="/"
          image="/"
          contentType="blog"
          settings={settings}
        />
        <Switch>
          {routes.map((route, i) => {
            return (
              <Route
                key={i}
                exact
                path={route.path}
                component={route.component}
              />
            );
          })}
        </Switch>
      </>
    );
  }
}
