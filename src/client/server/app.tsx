/**
 * This file is the entry point for creating a build for the server for a particular theme. It is
 * used in webpack.dev.js and webpack.prod.js.
 * We wont be able to debug this file.
 *
 *
 * This file will return a promise
 */
const { ServerStyleSheet, StyleSheetManager } = require("styled-components");
import React from "react";
import { Helmet } from "react-helmet";
import { StaticRouter, matchPath } from "react-router";
import { ApolloProvider as ApolloHocProvider } from "@apollo/react-hoc";
import { ApolloProvider } from "react-apollo";
import { renderToStringWithData } from "@apollo/react-ssr";
import config from "../../config";
import App, { IRoutes } from "../App";
import { StaticContext } from "../Context";
import { ThemesQuery, ThemeSettings } from "../../__generated__/gqlTypes";
import { THEME_SETTINGS } from "../../shared/queries/Queries";
import apolloClient from "../../shared/apolloClient";
import { TypeSettings, IServerRenderProps } from "../types";
import getRoutes from "../routes";
import logger from "../../shared/logger";

const context = {};

export default async (props: IServerRenderProps) => {
  const { requestUrl, client, settings, isStatic } = props;
  const opts = {
    location: requestUrl,
    context: context,
    basename: config.baseName.replace(/\/$/, ""), // remove the last slash
  };

  const initialData: IRoutes["initialData"] = {
    themeSettings: await getThemeSettings(settings),
    settings,
  };

  // We block rendering until all promises have resolved
  const matchedRoute = getRoutes(initialData).find(route => {
    const match = matchPath(requestUrl, route);
    return match && route.component.getInitialProps;
  });
  let initialProps: Promise<any> = Promise.resolve(null);
  if (
    matchedRoute &&
    typeof matchedRoute.component.getInitialProps === "function"
  ) {
    initialProps = await matchedRoute.component.getInitialProps({
      match: matchedRoute.path,
      req: "req",
      res: "res",
      client,
    });
  }
  logger.debug("SSR - Found initial props", JSON.stringify(initialProps));

  const sheet = new ServerStyleSheet(); // <-- creating out stylesheet
  const clientApp = (
    <StyleSheetManager sheet={sheet.instance}>
      <StaticRouter {...opts}>
        <StaticContext.Provider value={{ isStatic }}>
          <ApolloHocProvider client={client}>
            <ApolloProvider client={client}>
              <App initialData={{ ...initialData, initialProps }} />
            </ApolloProvider>
          </ApolloHocProvider>
        </StaticContext.Provider>
      </StaticRouter>
    </StyleSheetManager>
  );
  try {
    const content = await renderToStringWithData(clientApp);
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
};

/**
 * Get app initial data
 */
async function getThemeSettings(
  settings: TypeSettings,
): Promise<ThemeSettings[] | []> {
  const client = apolloClient();
  let themeSettings: ThemeSettings[] | [] = [];
  try {
    const themeResult = await client.query<ThemesQuery>({
      query: THEME_SETTINGS,
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
