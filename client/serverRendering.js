import React from "react";
import ReactDOM from "react-dom/server";
//import Helmet from 'react-helmet';
import { match, RouterContext } from "react-router";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { ApolloProvider } from "react-apollo";
import { createStore, applyMiddleware, compose } from "redux";

import prefetchComponentData from "../utils/prefetchComponentData";
import config from "../config/config";
import routes from "./routes";
import client from "./apolloClient";
import rootReducer from "./redux/reducers";
import thunk from "redux-thunk";

var initialState = {};
const store = createStore(
    rootReducer,
    initialState,
    compose(applyMiddleware(thunk, client.middleware()))
);

module.exports.init = app => {
    app.get("*", (req, res) => {
        match({ routes, location: req.url }, (
            error,
            redirectLocation,
            renderProps
        ) => {
            if (error) {
                res.status(500).send(error.message);
            } else if (redirectLocation) {
                res.redirect(
                    302,
                    redirectLocation.pathname + redirectLocation.search
                );
            } else if (renderProps) {
                prefetchComponentData(
                    store.dispatch,
                    renderProps.components,
                    renderProps.params
                )
                    .then(renderHTML)
                    .then(html => res.status(200).send(html))
                    .catch(err => res.end(err.message));
            } else {
                res.status(404).send("Not found");
            }

            function renderHTML() {
                const initialState = store.getState();

                const renderedComponent = ReactDOM.renderToString(
                    <ApolloProvider store={store} client={client}>
                        <RouterContext {...renderProps} />
                    </ApolloProvider>
                );

                //let head = Helmet.rewind();
                var bundle = process.env.NODE_ENV == "production"
                    ? "/js/app-client-bundle.js"
                    : "/static/app-client-bundle.js";
                const HTML = `
            <!DOCTYPE html>
            <html lang="en">
              <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1">

                <link rel="stylesheet" href="http://bootswatch.com/cosmo/bootstrap.min.css">
                <link rel="stylesheet" href="/css/client.css">
                <link rel="stylesheet" href="/css/font-awesome.min.css">
              </head>
              <body id='client' class='nav-md'>
                <div class='container body'>
                    <div id="app" class='main_container'>${renderedComponent}</div>
                </div>
                <script type="application/javascript">
                   window.__INITIAL_STATE__ = ${JSON.stringify(initialState)};
                   window.__CONFIG__ =  ${JSON.stringify(config)}
                </script>
                <script src="${bundle}"></script>
              </body>
            </html>
        `;

                return HTML;
            }
        });
    });
};
