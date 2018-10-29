import React from "react";
import { hydrate } from "react-dom";
import { ApolloProvider } from "react-apollo";
import { BrowserRouter } from "react-router-dom";
import client from "../shared/apolloClient";
import Routes from "./Routes";
import config from "../config";

const App = (
  <BrowserRouter basename={config.baseName}>
    <ApolloProvider client={client()}>
      <Routes />
    </ApolloProvider>
  </BrowserRouter>
);

hydrate(App, document.getElementById("app"));
