import React from "react";
import ReactDOM from "react-dom/server";
//import Helmet from 'react-helmet';
import { match, RouterContext } from "react-router";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { ApolloProvider } from "react-apollo";
import config from "../config/config";
import routes from "./routes";
import ApolloClient, { createNetworkInterface } from "apollo-client";
import { getDataFromTree, renderToStringWithData } from "react-apollo";

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
                sendResponse(renderProps).then(html => {
                    res.status(200);
                    res.send(html);
                    res.end();
                });
            } else {
                res.status(404).send("Not found");
            }
        });
    });
};

function sendResponse(renderProps) {
    const client = new ApolloClient({
        ssrMode: true,
        networkInterface: createNetworkInterface({
            uri: "http://localhost:3030/graphql"
        })
    });

    const app = (
        <ApolloProvider client={client}>
            <RouterContext {...renderProps} />
        </ApolloProvider>
    );
    return renderToStringWithData(app).then(content => {
        const initialState = {
            [client.reduxRootKey]: client.getInitialState()
        };
        return renderHTML(content, initialState);
    });
}

function renderHTML(content, state) {
    var bundle = process.env.NODE_ENV == "production"
        ? "/js/app-client-bundle.js"
        : "/static/app-client-bundle.js";
    const HTML = `
                    <!DOCTYPE html>
                    <html lang="en">
                    <head>
                        <meta charset="UTF-8">
                        <meta name="viewport" content="width=device-width, initial-scale=1">
                        <!-- Fonts -->
                        <link href='https://fonts.googleapis.com/css?family=Roboto+Condensed:400,300,400italic,700' rel='stylesheet' type='text/css'>
                        <link href='https://fonts.googleapis.com/css?family=Open+Sans:400,400italic,700' rel='stylesheet' type='text/css'>
                        <!--<link rel="stylesheet" href="http://bootswatch.com/cosmo/bootstrap.min.css">-->
                        <link rel="stylesheet" href="/css/bootstrap.min.css">
                        <link rel="stylesheet" href="/css/client.css">
                        <link rel="stylesheet" href="/css/vertical.css">
                        <link rel="stylesheet" href="/css/font-awesome.min.css">
                    </head>
                    <body id='client'>
                        <div id="app">${content}</div>
                        <script type="application/javascript">
                        window.__APOLLO_STATE__ = ${JSON.stringify(state)};
                        </script>
                        <script src="${bundle}"></script>
                    </body>
                    </html>
                `;

    return HTML;
}
