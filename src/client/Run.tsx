import React from "react";
import { hydrate } from "react-dom";
import { ApolloProvider } from "react-apollo";
import { BrowserRouter } from "react-router-dom";
import client from "../shared/apolloClient";
import ClientApp from "./ClientApp";
import config from "../config";
import { TypeSettings } from "./types";

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
    <ApolloProvider client={client()}>
      <ClientApp initialData={initialData} />
    </ApolloProvider>
  </BrowserRouter>
);

hydrate(LetterpadClient, document.getElementById("app"));
