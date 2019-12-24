import React, { useEffect } from "react";
import { RouteComponentProps } from "react-router";

import Layout from "./containers/Layout";
import config from "../config";
import { IRouteProps } from "./types";

function Renderer<T>(
  WrappedComponent: React.ComponentType<T>,
  routeProps: IRouteProps,
) {
  const Renderer: React.FC<RouteComponentProps> & {
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
    console.log("Renderer", routeProps);
    return (
      <Layout
        Renderer={WrappedComponent}
        {...(routeProps as IRouteProps)}
        router={{ ...props }}
      />
    );
  };

  Renderer.getInitialProps = async ctx => {
    // @ts-ignore: For the timebeing
    if (WrappedComponent.getInitialProps) {
      console.log("Renderer getinitialProps");
      // @ts-ignore: For the timebeing
      const props = await WrappedComponent.getInitialProps(ctx);
      return props;
    }
    return Promise.resolve(null);
  };
  return Renderer;
}
export default Renderer;
