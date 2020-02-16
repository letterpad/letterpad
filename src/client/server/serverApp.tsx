/**
 * This file is the entry point for creating a build for the server for a particular theme. It is
 * used in webpack.dev.js and webpack.prod.js.
 * We wont be able to debug this file.
 *
 *
 * This file will return a promise
 */
const { ServerStyleSheet, StyleSheetManager } = require("styled-components");

import ClientApp, { IRoutes } from "../ClientApp";
import { IServerRenderProps, TypeSettings } from "../types";
import { ThemeSettings, ThemesQuery } from "../../__generated__/gqlTypes";

import { ApolloProvider } from "react-apollo";
import { Helmet } from "react-helmet";
import { QUERY_THEMES } from "../../shared/queries/Queries";
import React from "react";
import { StaticContext } from "../Context";
import { StaticRouter } from "react-router";
import apolloClient from "../../shared/apolloClient";
import config from "../../config";
import { getMatchedRouteData } from "./helper";
import logger from "../../shared/logger";
import { renderToStringWithData } from "react-apollo";
import ssrFetch from "./ssrFetch";

const serverApp = async (props: IServerRenderProps) => {
  const { requestUrl, client, settings, isStatic } = props;

  const opts = {
    location: requestUrl,
    context: {},
    basename: config.BASE_NAME,
  };

  const initialData: IRoutes["initialData"] = {
    themeSettings: await getThemeSettings(settings),
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
/**
 * Get app initial data
 */
async function getThemeSettings(
  settings: TypeSettings,
): Promise<ThemeSettings[] | []> {
  const client = apolloClient(false);
  let themeSettings: ThemeSettings[] | [] = [];
  try {
    const themeResult = await client.query<ThemesQuery>({
      query: QUERY_THEMES,
      variables: {
        name: settings.theme.value,
      },
    });
    if (themeResult.data && themeResult.data.themes.length > 0) {
      themeSettings = themeResult.data.themes[0].settings as ThemeSettings[];
    }
    return themeSettings;
  } catch (e) {}
  return themeSettings;
}
