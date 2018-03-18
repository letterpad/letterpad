import React from "react";
import { hydrate } from "react-dom";
import { ApolloProvider } from "react-apollo";
import { BrowserRouter } from "react-router-dom";
import client from "./apolloClient";
import Route from "./Route";

const app = (
    <BrowserRouter>
        <ApolloProvider client={client}>
            <Route />
        </ApolloProvider>
    </BrowserRouter>
);

hydrate(app, document.getElementById("app"));

if (module.hot) {
    module.hot.accept("./Route", () => {
        const nextApp = require("./Route").default;
        hydrate(app, document.getElementById("app"));
    });
}
