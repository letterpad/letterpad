import React from "react";
import { hydrate } from "react-dom";
import { ApolloProvider } from "react-apollo";
import { BrowserRouter } from "react-router-dom";
import client from "./apolloClient";
import Route from "./Route";
import config from "../config";

const app = (
    <BrowserRouter basename={config.baseName}>
        <ApolloProvider client={client}>
            <Route />
        </ApolloProvider>
    </BrowserRouter>
);

hydrate(app, document.getElementById("app"));
