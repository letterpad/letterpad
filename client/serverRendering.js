import React from "react";
import ReactDOM from "react-dom/server";
//import Helmet from 'react-helmet';
import { createHttpLink } from "apollo-link-http";
import { InMemoryCache } from "apollo-cache-inmemory";
import fetch from "node-fetch";
import { StaticRouter } from "react-router";
import { ApolloProvider, getDataFromTree } from "react-apollo";
import ApolloClient from "apollo-client";
import App from "./containers/App";
import config from "../config";

const client = new ApolloClient({
    ssrMode: true,
    link: createHttpLink({
        uri: config.apiUrl,
        fetch
    }),
    cache: new InMemoryCache(),
    fetchPolicy: "network-only"
});
const context = {};

module.exports.init = app => {
    app.get("*", (req, res) => {
        const sendResponse = ({ content, initialState }) => {
            const html = <Html content={content} state={initialState} />;
            res.status(200);
            res.send(`<!doctype html>\n${ReactDOM.renderToStaticMarkup(html)}`);
            res.end();
        };
        let initialState = {};
        sendResponse({ contnt: null, initialState });
        // const adminApp = (
        //     <ApolloProvider client={client}>
        //         <StaticRouter location={req.url} context={context}>
        //             <App />
        //         </StaticRouter>
        //     </ApolloProvider>
        // );

        // getDataFromTree(adminApp).then(() => {
        //     const content = ReactDOM.renderToString(adminApp);
        //     initialState = client.extract();
        //     sendResponse({ content, initialState });
        // });
    });
};

function Html({ content, state }) {
    const devBundles = [
        // "/static/runtime~client-bundle.js",
        "/static/vendor-bundle.js",
        "/static/client-bundle.js"
    ];
    const prodBundles = [
        // "/js/runtime~client-bundle.js",
        "/js/vendor-bundle.js",
        "/js/client-bundle.js"
    ];
    const bundles =
        process.env.NODE_ENV === "production" ? prodBundles : devBundles;

    const insertScript = script => (
        <script type="text/javascript" src={script} defer />
    );

    const insertStyle = style => <link href={style} rel="stylesheet" />;
    return (
        <html lang="en">
            <head>
                <meta charSet="UTF-8" />
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1"
                />
                <title>Blog Dashboard</title>
                {insertStyle("/css/client.css")}
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
                {insertScript("/js/highlight.min.js")}

                {bundles.map(bundle => insertScript(bundle))}
            </body>
        </html>
    );
}
