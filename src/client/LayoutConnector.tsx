import { IRouteProps, IThemeContainer } from "./types";
import { Post, PostsNode } from "../__generated__/gqlTypes";
import React, { useEffect } from "react";

import DataConnector from "./DataConnector";
import { RouteComponentProps } from "react-router";

type TypeWrappedComponent =
  | IThemeContainer["Home"]
  | IThemeContainer["Post"]
  | IThemeContainer["Page"]
  | IThemeContainer["Posts"];

function LayoutConnector(
  WrappedComponent: TypeWrappedComponent,
  routeProps: IRouteProps<Post | PostsNode>,
  Layout: React.ComponentType<any>,
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
        setTimeout(() => {
          // @ts-ignore
          gtag("config", routeProps.settings.google_analytics.value, {
            page_title: document.title,
            page_path: document.location.pathname,
          });
        }, 1000);
      }
    };
    return (
      <Layout
        Content={DataConnector(WrappedComponent, routeProps.contentType)}
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
