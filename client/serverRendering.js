import React from "react";
import ReactDOM from "react-dom/server";
import { Helmet } from "react-helmet";
import { createHttpLink } from "apollo-link-http";
import { InMemoryCache } from "apollo-cache-inmemory";
import fetch from "node-fetch";
import { StaticRouter } from "react-router";
import { ApolloProvider, getDataFromTree } from "react-apollo";
import ApolloClient from "apollo-client";
import App from "./containers/App";
import config from "../config";

const context = {};

module.exports.init = app => {
    app.get("*", (req, res) => {
        const client = new ApolloClient({
            ssrMode: true,
            link: createHttpLink({
                uri: config.apiUrl,
                fetch
            }),
            cache: new InMemoryCache()
        });

        const sendResponse = ({ content, initialState, head }) => {
            const html = getHtml(content, initialState, head);
            // const html = ReactDOM.renderToStaticMarkup(htmlComponent);
            res.status(200);
            res.send(`<!doctype html>\n${html}`);
            res.end();
        };
        let initialState = {};

        const adminApp = (
            <ApolloProvider client={client}>
                <StaticRouter location={req.url} context={context}>
                    <App />
                </StaticRouter>
            </ApolloProvider>
        );

        getDataFromTree(adminApp).then(() => {
            const content = ReactDOM.renderToString(adminApp);
            const head = Helmet.renderStatic();
            initialState = client.extract();
            sendResponse({ content, initialState, head });
        });
    });
};

function getHtml(content, state, head) {
    let htmlAttrs = "";
    const metaTags = Object.keys(head)
        .map(item => {
            if (item == "htmlAttributes") {
                htmlAttrs = head[item].toString();
                return "";
            }
            return head[item].toString();
        })
        .filter(x => x)
        .join("");
    const devBundles = [
        "/js/highlight.min.js",
        "/static/vendor-bundle.js",
        "/static/client-bundle.js"
    ];
    const prodBundles = [
        "/js/highlight.min.js",
        "/js/vendor-bundle.js",
        "/js/client-bundle.js"
    ];
    const bundles =
        process.env.NODE_ENV === "production" ? prodBundles : devBundles;

    const insertScript = script =>
        `<script type="text/javascript" src="${script}" defer></script>`;

    const initialState = JSON.stringify(state); //.replace(/</g, "\\u003c");
    const scripts = bundles.map(bundle => insertScript(bundle));

    return `<html ${htmlAttrs}>
            <head>
                <meta charSet="UTF-8" />
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1"
                />
                ${metaTags}
                <link href="/css/client.css" rel="stylesheet"/>
                <link href="/css/custom.css" rel="stylesheet"/>
            </head>
            <body>
                <div id="app">${content}</div>
                <script>
                    window.__APOLLO_STATE__=${initialState};
                    window.NODE_ENV = "${process.env.NODE_ENV}";
                </script>
                ${scripts.join("")}
            </body>
        </html>`;
}
