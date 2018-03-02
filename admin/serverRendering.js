import React from "react";
import ReactDOM from "react-dom/server";
//import Helmet from 'react-helmet';
import { createHttpLink } from "apollo-link-http";
import { InMemoryCache } from "apollo-cache-inmemory";
import fetch from "node-fetch";
import { StaticRouter } from "react-router";
import { ApolloProvider, getDataFromTree } from "react-apollo";
import ApolloClient from "apollo-client";
import config from "../config";
import App from "./containers/App";

const client = new ApolloClient({
    ssrMode: false,
    link: createHttpLink({
        uri: config.apiUrl,
        fetch
    }),
    cache: new InMemoryCache()
});
const context = {};

module.exports.init = app => {
    app.get("/admin/*", (req, res) => {
        const sendResponse = ({ content, initialState }) => {
            const html = <Html content={content} state={initialState} />;
            res.status(200);
            res.send(`<!doctype html>\n${ReactDOM.renderToStaticMarkup(html)}`);
            res.end();
        };
        let initialState = {};
        sendResponse({ content: null, initialState });
        // if (!req.headers.cookie) {
        //     const adminApp = (
        //         <ApolloProvider client={client}>
        //             <StaticRouter location={req.url} context={context}>
        //                 <App />
        //             </StaticRouter>
        //         </ApolloProvider>
        //     );
        //     getDataFromTree(adminApp).then(() => {
        //         const content = ReactDOM.renderToString(adminApp);
        //         initialState = client.extract();
        //         sendResponse({ content, initialState });
        //     });
        // } else {
        //     sendResponse({ content: null, initialState });
        // }
    });
};

function Html({ content, state }) {
    const devBundles = [
        "/static/runtime~admin-bundle.js",
        "/static/vendor-bundle.js",
        "/static/admin-bundle.js"
    ];
    const prodBundles = [
        "/js/runtime~admin-bundle.js",
        "/js/vendor-bundle.js",
        "/js/admin-bundle.js"
    ];
    const bundles =
        process.env.NODE_ENV === "production" ? prodBundles : devBundles;

    const insertScript = script => (
        <script type="text/javascript" src={script} defer />
    );

    const insertStyle = style => (
        <link href={style} rel="stylesheet" type="text/css" />
    );

    return (
        <html lang="en">
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
                    "http://cdn.jsdelivr.net/highlight.js/9.8.0/styles/monokai.min.css"
                )}
                {insertStyle("https://cdn.quilljs.com/1.2.2/quill.snow.css")}
                {insertStyle("/css/admin.css")}
            </head>
            <body>
                <div id="app" dangerouslySetInnerHTML={{ __html: content }} />
                <script
                    dangerouslySetInnerHTML={{
                        __html: `window.__APOLLO_STATE__=${JSON.stringify(
                            state
                        ).replace(/</g, "\\u003c")};window.NODE_ENV = "${
                            process.env.NODE_ENV
                        }";`
                    }}
                />
                {insertScript("/tinymce/js/tinymce/tinymce.min.js")}
                {insertScript("/js/highlight.min.js")}
                {insertScript("https://cdn.quilljs.com/1.2.2/quill.js")}
                {bundles.map(bundle => insertScript(bundle))}
            </body>
        </html>
    );
}
