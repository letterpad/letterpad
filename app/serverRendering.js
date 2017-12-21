import React from "react";
import ReactDOM from "react-dom/server";
//import Helmet from 'react-helmet';
import { match, RouterContext, StaticRouter } from "react-router";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import {
    ApolloProvider,
    getDataFromTree,
    renderToStringWithData
} from "react-apollo";
import { createStore, applyMiddleware, compose } from "redux";
import ApolloClient from "apollo-client";
import config from "../config/config";
import routes from "./routes";
import { doLogin } from "./api/actions";
import thunk from "redux-thunk";
import Request from "request";
let session = require("express-session");
import { createHttpLink } from "apollo-link-http";
import { InMemoryCache } from "apollo-cache-inmemory";

var initialState = {};

const client = new ApolloClient({
    ssrMode: true,
    link: createHttpLink({
        uri: "http://localhost:3030/graphql"
    }),
    cache: new InMemoryCache()
});
const context = {};

module.exports.init = app => {
    app.get("/admin/*", (req, res) => {
        match(
            { routes, location: req.url },
            (error, redirectLocation, renderProps) => {
                if (error) {
                    return res.status(500).send(error.message);
                }

                if (redirectLocation) {
                    return res.redirect(
                        302,
                        redirectLocation.pathname + redirectLocation.search
                    );
                }
                if (!renderProps) {
                    return res.status(404).send("Not found");
                }
                const app = (
                    <ApolloProvider client={client}>
                        <RouterContext {...renderProps} />
                    </ApolloProvider>
                );
                const sendResponse = ({ content, initialState }) => {
                    const html = (
                        <Html content={content} state={initialState} />
                    );
                    res.status(200);
                    res.send(
                        `<!doctype html>\n${ReactDOM.renderToStaticMarkup(
                            html
                        )}`
                    );
                    res.end();
                };
                let initialState = {};
                if (!req.headers.cookie) {
                    getDataFromTree(app).then(() => {
                        const content = ReactDOM.renderToString(app);
                        initialState = client.extract();
                        sendResponse({ content, initialState });
                    });
                } else {
                    sendResponse({ content: null, initialState });
                }
            }
        );
    });
};

function Html({ content, state }) {
    var bundle =
        process.env.NODE_ENV == "production"
            ? "/js/app-admin-bundle.js"
            : "/static/app-admin-bundle.js";

    const insertScript = script => {
        return <script type="text/javascript" src={script} />;
    };
    const insertStyle = style => {
        return <link href={style} rel="stylesheet" type="text/css" />;
    };
    return (
        <html>
            <head>
                <meta charSet="UTF-8" />
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1"
                />
                <title>Blog Dashboard</title>
                {insertStyle(
                    "https://fonts.googleapis.com/css?family=Open+Sans:400,400italic,700"
                )}
                {insertStyle("/css/bootstrap.min.css")}
                {insertStyle("/css/vertical.css")}
                {insertStyle("/css/font-awesome.min.css")}
                {insertStyle(
                    "http://cdn.jsdelivr.net/highlight.js/9.8.0/styles/default.min.css"
                )}
                {insertStyle("https://cdn.quilljs.com/1.2.2/quill.snow.css")}
            </head>
            <body>
                <div id="app" dangerouslySetInnerHTML={{ __html: content }} />
                <script
                    dangerouslySetInnerHTML={{
                        __html: `window.__APOLLO_STATE__=${JSON.stringify(
                            state
                        ).replace(/</g, "\\u003c")};`
                    }}
                />
                {insertScript("/tinymce/js/tinymce/tinymce.min.js")}
                {insertScript("/js/highlight.min.js")}
                {insertScript("https://cdn.quilljs.com/1.2.2/quill.js")}
                {insertScript(bundle)}
            </body>
        </html>
    );
}
