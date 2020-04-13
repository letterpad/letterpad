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
  // WrappedComponent.displayName = "Hello";/
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
      if (routeProps.settings.google_analytics) {
        setTimeout(() => {
          // @ts-ignore
          gtag("config", routeProps.settings.google_analytics, {
            page_title: document.title,
            page_path: document.location.pathname,
          });
        }, 1000);
      }
    };
    return (
      <Layout
        Content={DataConnector(WrappedComponent, routeProps.contentType)}
        router={{ ...props }}
        {...routeProps}
      />
    );
  };

  return LayoutConnector;
}
export default LayoutConnector;
