import { hydrate, render } from "react-dom";

import { ApolloProvider } from "react-apollo";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
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

let initialData: any = {
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
      <App initialData={initialData} />
    </ApolloProvider>
  </BrowserRouter>
);

const renderMethod = (module as any).hot ? render : hydrate;
renderMethod(LetterpadClient, document.getElementById("app"));

if ((module as any).hot) {
  (module as any).hot.accept();
}
