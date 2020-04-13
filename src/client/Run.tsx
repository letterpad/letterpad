import { hydrate, render } from "react-dom";

import { ApolloProvider } from "react-apollo";
import { BrowserRouter } from "react-router-dom";
import ClientApp from "./ClientApp";
import React from "react";
import { Setting } from "../__generated__/gqlTypes";
import client from "../shared/apolloClient";
import config from "../config";

declare global {
  interface Window {
    ga: () => void;
    __INITIAL_DATA__: {
      settings: Setting;
      themeSettings: [];
      data: null;
    };
  }
}

let initialData = {
  settings: {},
  themeSettings: [],
  data: null,
};
if (window.__INITIAL_DATA__) {
  initialData = window.__INITIAL_DATA__;
}

const LetterpadClient = (
  <BrowserRouter basename={config.BASE_NAME}>
    <ApolloProvider client={client(false)}>
      <ClientApp initialData={initialData} />
    </ApolloProvider>
  </BrowserRouter>
);

const renderMethod = module.hot ? render : hydrate;
renderMethod(LetterpadClient, document.getElementById("app"));

if (module.hot) {
  module.hot.accept();
}
