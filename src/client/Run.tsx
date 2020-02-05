import { ApolloProvider } from "react-apollo";
import { BrowserRouter } from "react-router-dom";
import ClientApp from "./ClientApp";
import React from "react";
import { TypeSettings } from "./types";
import client from "../shared/apolloClient";
import config from "../config";
import { hydrate } from "react-dom";

declare global {
  interface Window {
    ga: () => void;
    __INITIAL_DATA__: {
      settings: TypeSettings;
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
  <BrowserRouter basename={config.baseName}>
    <ApolloProvider client={client(false)}>
      <ClientApp initialData={initialData} />
    </ApolloProvider>
  </BrowserRouter>
);

hydrate(LetterpadClient, document.getElementById("app"));
