import React from "react";
import ssrPrepass from "react-ssr-prepass-fork";
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
  try {
    await ssrPrepass(serverApp, (element, _instance) => {
      //@ts-ignore
      if (!element || !element.type) {
        logger.error("`type` of React element was not found,", element);
        return null;
      }
      //@ts-ignore
      const { getInitialProps, name } = element.type;
      if (getInitialProps) {
        try {
          return getInitialProps(context).then((data: unknown) => {
            logger.success(
              `Successfully fetched data from ${name} component:`,
              data,
            );
            initialProps[name] = data;
          });
        } catch (e) {
          logger.error(
            "Failed to fetch initial SSR Data. Check the component " + name,
            e,
          );
        }
      }
    });
  } catch (e) {
    logger.error("Failed to fetch data from server while executing ssr", e);
  }
  return initialProps;
};
export default ssrFetch;
