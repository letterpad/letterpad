/**
 * This file is the entry point for creating a build for the server for a particular theme. It is
 * used in webpack.dev.js and webpack.prod.js.
 * We wont be able to debug this file.
 *
 *
 * This file will return a promise
 */
const { ServerStyleSheet, StyleSheetManager } = require("styled-components");

import { ApolloProvider, renderToStringWithData } from "react-apollo";
import ClientApp, { IRoutes } from "../ClientApp";

import { Helmet } from "react-helmet";
import { IServerRenderProps } from "../types";
import React from "react";
import { StaticContext } from "../Context";
import { StaticRouter } from "react-router";
import config from "../../config";
import { getMatchedRouteData } from "./helper";
import logger from "../../shared/logger";
import ssrFetch from "./ssrFetch";

const serverApp = async (props: IServerRenderProps) => {
  const { requestUrl, client, settings, isStatic, themeSettings } = props;

  const opts = {
    location: requestUrl,
    context: {},
    basename: config.BASE_NAME,
  };

  const initialData: IRoutes["initialData"] = {
    themeSettings,
    settings,
  };

  const sheet = new ServerStyleSheet(); // <-- creating out stylesheet
  const serverApp = (
    <StyleSheetManager sheet={sheet.instance}>
      <StaticRouter {...opts}>
        <ApolloProvider client={client}>
          <StaticContext.Provider value={{ isStatic }}>
            <ClientApp initialData={{ ...initialData }} />
          </StaticContext.Provider>
        </ApolloProvider>
      </StaticRouter>
    </StyleSheetManager>
  );
  const matchedRouteData = getMatchedRouteData(initialData, requestUrl);

  if (matchedRouteData) {
    try {
      const context = {
        client,
        match: matchedRouteData,
      };
      logger.debug("Matched route data: ", matchedRouteData);
      const initialProps = await ssrFetch(serverApp, context);
      const content = await renderToStringWithData(serverApp);
      const initialState = client.extract();
      return {
        head: Helmet.renderStatic(),
        html: content,
        initialData: { ...initialData, initialProps },
        apolloState: initialState,
        sheet: sheet,
      };
    } catch (error) {
      logger.error("Unable to render app");
      logger.error(error);
    }
  } else {
    logger.error("The incoming request could not be handled by the server");
  }
};

export default serverApp;
