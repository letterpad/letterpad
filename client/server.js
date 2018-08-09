/**
 * This file is the entry point for creating a build for the server for a particular theme. It is
 * used in webpack.dev.js and webpack.prod.js.
 * We wont be able to debug this file.
 *
 *
 * This file will return a promise
 */

import React from "react";
import { renderToString } from "react-dom/server";
import { Helmet } from "react-helmet";
import { StaticRouter } from "react-router";
import { ApolloProvider, getDataFromTree } from "react-apollo";
const { ServerStyleSheet } = require("styled-components");
import Routes from "./Routes";

const context = {};

export default (req, client, config) => {
    const opts = {
        location: req.url,
        context: context,
        basename: config.baseName.replace(/\/$/, "") // remove the last slash
    };
    const clientApp = (
        <ApolloProvider client={client}>
            <StaticRouter {...opts}>
                <Routes />
            </StaticRouter>
        </ApolloProvider>
    );
    // we will wait for the appropriate route to render the component and fetch necessary data.
    // we will return a promise which will resolve to an object.
    return Promise.all([getDataFromTree(clientApp)])
        .catch(function(err) {
            // log that I have an error, return the entire array;
            console.log("A promise failed to resolve", err);
        })
        .then(() => {
            try {
                const sheet = new ServerStyleSheet(); // <-- creating out stylesheet
                return {
                    head: Helmet.renderStatic(),
                    html: renderToString(sheet.collectStyles(clientApp)),
                    apolloState: client.extract(),
                    sheet: sheet
                };
            } catch (e) {
                console.log(e);
            }
        });
};
