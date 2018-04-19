/*
  Import Dependencies
*/
import React from "react";
import { hydrate } from "react-dom";
import { ApolloProvider } from "react-apollo";
import { BrowserRouter } from "react-router-dom";
import client from "./apolloClient";
import Main from "./main";
import { Route, Switch } from "react-router-dom";
import LoginView from "./containers/LoginView";
import "isomorphic-fetch";
import config from "../config";
/*
  Rendering
  This is where we hook up the Store with our actual component and the router
*/

const app = (
    <BrowserRouter basename={config.baseName}>
        <ApolloProvider client={client}>
            <Switch>
                <Main />
            </Switch>
        </ApolloProvider>
    </BrowserRouter>
);

hydrate(app, document.getElementById("app"));
