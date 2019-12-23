import React, { useEffect } from "react";
import { RouteComponentProps } from "react-router";
import ApolloClient from "apollo-client";
import { TypeSettings } from "./Routes";
import Layout from "./containers/Layout";
import { ThemeSettings } from "../__generated__/gqlTypes";
import config from "../config";

interface ILayoutProps {
  type: string;
  settings: TypeSettings;
  client: ApolloClient<any>;
  themeConfig: ThemeSettings[];
}

function Renderer<T>(
  WrappedComponent: React.ComponentType<T>,
  layoutProps: ILayoutProps,
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
        {...(layoutProps as ILayoutProps)}
        router={{ ...props }}
      />
    );
  };
}

export default Renderer;
