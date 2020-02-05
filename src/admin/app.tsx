import "isomorphic-fetch";

import { ApolloProvider } from "react-apollo";
import { BrowserRouter } from "react-router-dom";
/*
  Import Dependencies
*/
import React from "react";
import Routes from "./Routes";
import client from "../shared/apolloClient";
import config from "../config";
import { render } from "react-dom";

const isAdmin = true;

const App = (
  <BrowserRouter basename={config.BASE_NAME}>
    <ApolloProvider client={client(isAdmin)}>
      <Routes />
    </ApolloProvider>
  </BrowserRouter>
);

render(App, document.getElementById("app"));
