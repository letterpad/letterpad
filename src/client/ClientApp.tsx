import React, { Component } from "react";
import { Route, Switch } from "react-router-dom";

import SEO from "./helpers/SEO";
import { ThemeSettings } from "../__generated__/gqlTypes";
import { TypeSettings } from "./types";
import getRoutes from "./routes";

/*!------------------------------------------------------------------
[View Containers-]
*/

export interface IRoutes {
  initialData: {
    settings: TypeSettings | {};
    themeSettings: ThemeSettings[] | [];
    initialProps?: {} | null;
  };
}

class ClientApp extends Component<IRoutes, {}> {
  applyCustomCSS = ({ css }) => {
    if (typeof document == "undefined" || typeof css == "undefined")
      return false;
    const style = document.createElement("style");
    style.setAttribute("type", "text/css");
    style.innerText = css.value;
    document.head.appendChild(style);
  };

  render() {
    const settings = this.props.initialData.settings as TypeSettings;
    this.applyCustomCSS(settings);
    const routes = getRoutes({ ...this.props.initialData });
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
      </div>
    );
  }
}

export default ClientApp;
