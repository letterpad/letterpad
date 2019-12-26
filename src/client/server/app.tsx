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
import App from "../App";
import { StaticContext } from "../Context";
import { ThemesQuery, ThemeSettings } from "../../__generated__/gqlTypes";
import { THEME_SETTINGS } from "../../shared/queries/Queries";
import apolloClient from "../../shared/apolloClient";
import { TypeSettings, IServerRenderProps } from "../types";
import getRoutes from "../routes";

const context = {};

export default async (props: IServerRenderProps) => {
  const { requestUrl, client, settings, isStatic } = props;
  const opts = {
    location: requestUrl,
    context: context,
    basename: config.baseName.replace(/\/$/, ""), // remove the last slash
  };
  const initialData = await getInitialData(settings);
  // We block rendering until all promises have resolved
  const matchedRoute = getRoutes(initialData).filter(route => {
    const match = matchPath(requestUrl, route);
    // @ts-ignore
    return match && route.component.getInitialProps;
  });
  let matchedRouteProps = null;
  if (matchedRoute.length > 0) {
    // @ts-ignore
    matchedRouteProps = matchedRoute[0].component.getInitialProps({
      match: "",
      req: "req",
      res: "res",
      client,
    });
  }
  const initialProps = await Promise.all([matchedRouteProps]);
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
    console.log("error :", error);
  }
};

interface initialData {
  settings: TypeSettings | {};
  themeSettings: ThemeSettings[] | [];
}

async function getInitialData(settings: TypeSettings) {
  const client = apolloClient();
  const initialData: initialData = { settings: settings, themeSettings: [] };
  try {
    const themeResult = await client.query<ThemesQuery>({
      query: THEME_SETTINGS,
      variables: {
        name: settings.theme.value,
      },
    });
    if (themeResult.data && themeResult.data.themes.length > 0) {
      initialData.themeSettings = themeResult.data.themes[0].settings;
    }
    return initialData;
  } catch (e) {}
  return initialData;
}
