import React from "react";
import ssrPrepass from "react-ssr-prepass";
import ApolloClient from "apollo-client";
import logger from "../../shared/logger";
import { match } from "react-router";

interface ISsrFetchContext {
  client: ApolloClient<any>;
  match: match<{}> | null;
}
const ssrFetch = async (
  serverApp: React.ReactNode,
  context: ISsrFetchContext,
) => {
  const initialProps = {};
  logger.debug("Fetching initial data for the route");
  await ssrPrepass(serverApp, (element, _instance) => {
    //@ts-ignore
    const { getInitialProps, name } = element.type;
    if (getInitialProps) {
      try {
        return getInitialProps(context).then((data: unknown) => {
          logger.debug(`SSR Fetch from ${name} component:`, data);
          initialProps[name] = data;
        });
      } catch (e) {
        logger.warning(
          "Failed to fetch initial SSR Data. Check the component " + name,
        );
      }
    }
  });
  return initialProps;
};
export default ssrFetch;
