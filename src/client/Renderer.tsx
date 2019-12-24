import React, { useEffect } from "react";
import { RouteComponentProps } from "react-router";

import Layout from "./containers/Layout";
import config from "../config";
import { IRouteProps } from "./types";

function Renderer<T>(
  WrappedComponent: React.ComponentType<T>,
  layoutProps: IRouteProps,
) {
  return (props: RouteComponentProps) => {
    useEffect(() => {
      const unlistenHistory = props.history.listen(analyticsAction);
      return () => {
        unlistenHistory();
      };
    }, []);

    const analyticsAction = () => {
      if (layoutProps.settings.google_analytics.value) {
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
        {...(layoutProps as IRouteProps)}
        router={{ ...props }}
      />
    );
  };
}

export default Renderer;
