import React, { useEffect } from "react";
import { RouteComponentProps } from "react-router";

import Layout from "./containers/Layout";
import config from "../config";
import { IRouteProps, IThemeContainer } from "./types";

function LayoutConnector(
  WrappedComponent: IThemeContainer,
  routeProps: IRouteProps,
) {
  const LayoutConnector: React.FC<RouteComponentProps> & {
    getInitialProps?: ({ match, req, res, client }: any) => Promise<any>;
  } = props => {
    useEffect(() => {
      const unlistenHistory = props.history.listen(analyticsAction);
      return () => {
        unlistenHistory();
        if (WrappedComponent.getInitialProps) {
          WrappedComponent.getInitialProps({
            match: props.match,
            client: routeProps.client,
          });
        }
      };
    }, []);

    const analyticsAction = () => {
      if (routeProps.settings.google_analytics.value) {
        // @ts-ignore: Global ga.
        // @todo - add this to window object
        ga("set", "page", config.BASE_NAME + location.pathname);
        // @ts-ignore: global ga
        ga("send", "pageview");
      }
    };
    return (
      <Layout
        Content={WrappedComponent}
        contentType={routeProps.contentType}
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
