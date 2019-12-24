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
import { StaticRouter } from "react-router";
import { ApolloProvider as ApolloHocProvider } from "@apollo/react-hoc";
import { ApolloProvider } from "react-apollo";
import { renderToStringWithData } from "@apollo/react-ssr";
import config from "../../config";
import Routes from "../Routes";
import { StaticContext } from "../Context";
import { ThemesQuery, ThemeSettings } from "../../__generated__/gqlTypes";
import { THEME_SETTINGS } from "../../shared/queries/Queries";
import apolloClient from "../../shared/apolloClient";
import { TypeSettings, IServerRenderProps } from "../types";

const context = {};

export default async (props: IServerRenderProps) => {
  const { requestUrl, client, settings, isStatic } = props;
  const opts = {
    location: requestUrl,
    context: context,
    basename: config.baseName.replace(/\/$/, ""), // remove the last slash
  };
  const initialData = await getThemeData(settings);
  console.log(initialData);
  const sheet = new ServerStyleSheet(); // <-- creating out stylesheet
  const clientApp = (
    <StyleSheetManager sheet={sheet.instance}>
      <StaticRouter {...opts}>
        <StaticContext.Provider value={{ isStatic }}>
          <ApolloHocProvider client={client}>
            <ApolloProvider client={client}>
              <Routes initialData={initialData} />
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
      initialData: initialData,
      apolloState: initialState,
      sheet: sheet,
    };
  } catch (error) {
    console.log("error :", error);
  }
};

interface initialData {
  settings: TypeSettings | {};
  themeConfig: ThemeSettings[] | [];
}

async function getThemeData(settings: TypeSettings) {
  const client = apolloClient();
  const initialData: initialData = { settings: settings, themeConfig: [] };
  try {
    const themeResult = await client.query<ThemesQuery>({
      query: THEME_SETTINGS,
      variables: {
        name: settings.theme.value,
      },
    });
    if (themeResult.data && themeResult.data.themes.length > 0) {
      initialData.themeConfig = themeResult.data.themes[0].settings;
    }
    return initialData;
  } catch (e) {}
  return initialData;
}
