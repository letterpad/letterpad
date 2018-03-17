import React from "react";
import { hydrate } from "react-dom";
import { ApolloProvider } from "react-apollo";
import { BrowserRouter } from "react-router-dom";
import client from "./apolloClient";
import App from "./containers/App";

const app = (
    <BrowserRouter>
        <ApolloProvider client={client}>
            <App />
        </ApolloProvider>
    </BrowserRouter>
);

hydrate(app, document.getElementById("app"));
