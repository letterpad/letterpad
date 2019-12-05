/**
 * This file is the entry point for creating a build for the server for a particular theme. It is
 * used in webpack.dev.js and webpack.prod.js.
 * We wont be able to debug this file.
 *
 *
 * This file will return a promise
 */

import React from "react";
import { Helmet } from "react-helmet";
import { StaticRouter } from "react-router";
import { ApolloProvider as ApolloHocProvider } from "@apollo/react-hoc";
import { ApolloProvider } from "react-apollo";
import { renderToStringWithData } from "@apollo/react-ssr";
const { ServerStyleSheet, StyleSheetManager } = require("styled-components");
import Routes from "../common/Routes";
import { StaticContext } from "../common/Context";

const context = {};

export default async (url, client, config, isStatic) => {
  const opts = {
    location: url,
    context: context,
    basename: config.baseName.replace(/\/$/, ""), // remove the last slash
  };
  const sheet = new ServerStyleSheet(); // <-- creating out stylesheet
  const clientApp = (
    <StyleSheetManager sheet={sheet.instance}>
      <StaticRouter {...opts}>
        <StaticContext.Provider value={{ isStatic }}>
          <ApolloHocProvider client={client}>
            <ApolloProvider client={client}>
              <Routes />
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
      apolloState: initialState,
      sheet: sheet,
    };
  } catch (error) {
    console.log("error :", error);
  }
};
