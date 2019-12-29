import React, { useEffect } from "react";
import { RouteComponentProps } from "react-router";

import Layout from "./containers/Layout";
import config from "../config";
import { IRouteProps, TypeWrappedComponent } from "./types";

function LayoutConnector(
  WrappedComponent: TypeWrappedComponent,
  routeProps: IRouteProps,
) {
  const LayoutConnector: React.FC<RouteComponentProps> & {
    getInitialProps?: ({ match, req, res, client }: any) => Promise<any>;
  } = props => {
    useEffect(() => {
      const unlistenHistory = props.history.listen(analyticsAction);
      return () => {
        unlistenHistory();
      };
    }, []);

    const analyticsAction = () => {
      if (routeProps.settings.google_analytics.value) {
        // @ts-ignore: Global ga.
        // @todo - add this to window object
        ga("set", "page", config.baseName + location.pathname);
        // @ts-ignore: global ga
        ga("send", "pageview");
      }
    };
    return (
      <Layout
        Renderer={WrappedComponent}
        type={routeProps.type}
        settings={routeProps.settings}
        client={routeProps.client}
        themeSettings={routeProps.themeSettings}
        initialProps={routeProps.initialProps}
        router={{ ...props }}
      />
    );
  };

  return LayoutConnector;
}
export default LayoutConnector;
