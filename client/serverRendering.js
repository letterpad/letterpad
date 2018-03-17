import ApolloClient from "apollo-client";
import { createHttpLink } from "apollo-link-http";
import { InMemoryCache } from "apollo-cache-inmemory";
import fetch from "node-fetch";
import config from "../config";
import { GET_OPTIONS } from "../shared/queries/Queries";

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
        client.query({ query: GET_OPTIONS }).then(settings => {
            const theme = settings.data.settings.filter(
                item => item.option == "theme"
            )[0].value;

            let serverFile = "../build/" + theme + ".server";
            // const theme = req.query.theme;
            // if (theme == "amun") {
            //     serFile = "../dist/amun.server";
            // } else if (theme == "uranium") {
            //     serFile = "../dist/uranium.server";
            // }
            const server = require(serverFile).default;
            server(req, client).then(({ html, apolloState, head }) => {
                res.end(getHtml(theme, html, apolloState, head));
            });
        });
    });
};

function getHtml(theme, html, state, head) {
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
    let devBundles = [
        "/js/highlight.min.js",
        "/static/vendor-bundle.js",
        "/static/client-bundle.js"
    ];
    if (theme === "amun") {
        devBundles[2] = "/dist/amun-bundle.js";
    }
    if (theme === "uranium") {
        devBundles[2] = "/dist/uranium-bundle.js";
    }
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
                <div id="app">${html}</div>
                <script>
                    window.__APOLLO_STATE__=${initialState};
                    window.NODE_ENV = "${process.env.NODE_ENV}";
                </script>
                ${scripts.join("")}
            </body>
        </html>`;
}
