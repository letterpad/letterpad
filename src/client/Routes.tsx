import React, { Component } from "react";
import { Route, Switch } from "react-router-dom";
import SEO from "./helpers/SEO";
import { hot } from "react-hot-loader";
/*!------------------------------------------------------------------
[View Containers-]
*/

import { ThemeSettings } from "../__generated__/gqlTypes";

import { TypeSettings } from "./types";
import getRoutes from "./_routes";

export interface IRoutes {
  initialData: {
    settings: TypeSettings | {};
    themeSettings: ThemeSettings[] | [];
    data?: {} | null;
  };
}

class Routes extends Component<IRoutes, {}> {
  static getInitialProps = (props: any) => {
    return Promise.resolve({
      testData: "hello world",
    });
  };

  applyCustomCSS = ({ css }) => {
    if (typeof document == "undefined" || typeof css == "undefined")
      return false;
    const style = document.createElement("style");
    style.setAttribute("type", "text/css");
    style.innerText = css.value;
    document.head.appendChild(style);
  };

  render() {
    // console.log("Routes", JSON.stringify(this.props.initialData.data));
    if (this.props["isLoading"]) return null;
    const settings = this.props.initialData.settings as TypeSettings;

    this.applyCustomCSS(settings);
    const routes = getRoutes(this.props.initialData);
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
