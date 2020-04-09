import "isomorphic-fetch";

import {
  AdminBaseStyle,
  AdminGlobalStyle,
  NormalizeCss,
} from "./adminGlobal.css";

import { ApolloProvider } from "react-apollo";
import { BrowserRouter } from "react-router-dom";
import React from "react";
import Routes from "./Routes";
import client from "../shared/apolloClient";
import config from "../config";
import { render } from "react-dom";

const isAdmin = true;

const App = () => {
  return (
    <BrowserRouter basename={config.BASE_NAME}>
      <ApolloProvider client={client(isAdmin)}>
        <NormalizeCss />
        <AdminGlobalStyle />
        <AdminBaseStyle />
        <Routes />
      </ApolloProvider>
    </BrowserRouter>
  );
};

render(<App />, document.getElementById("app"));

if (module.hot) {
  module.hot.accept();
}
