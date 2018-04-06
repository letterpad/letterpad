const express = require("express");
import ApolloClient from "apollo-client";
import path from "path";
import { createHttpLink } from "apollo-link-http";
import { InMemoryCache } from "apollo-cache-inmemory";
import fetch from "node-fetch";
import fs from "fs";
import config from "../config";
import { makeUrl } from "../shared/util";
import { GET_OPTIONS } from "../shared/queries/Queries";

const getParams = query => {
    if (!query) {
        return {};
    }

    let hashes = query.slice(query.indexOf("?") + 1).split("&");
    let params = {};
    hashes.map(hash => {
        let [key, val] = hash.split("=");
        params[key] = decodeURIComponent(val);
    });

    return params;
};

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
            let theme = settings.data.settings.filter(
                item => item.option == "theme"
            )[0].value;

            // In dev mode if a theme is explicitly called, then use that
            if (process.env.THEME && process.env.THEME !== "") {
                theme = process.env.THEME;
            }
            let serverFile =
                "./themes/" + theme + "/public/dist/server.node.js";
            const urlParams = {
                ...getParams(req.originalUrl),
                ...getParams(req.header("Referer"))
            };
            let previewTheme = false;

            if (urlParams && "theme" in urlParams) {
                theme = urlParams.theme;
                previewTheme = true;
            }

            if (previewTheme) {
                const previewThemePath =
                    "./themes/" + theme + "/public/dist/server.node.js";
                if (fs.existsSync(path.join(__dirname, previewThemePath))) {
                    console.log("Previewing ", theme);
                    serverFile = previewThemePath;
                } else {
                    console.log(
                        "Server bundle for theme " + theme + " not found"
                    );
                }
            }
            console.log("Running server instance: ", serverFile);
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
        theme + "/js/highlight.min.js",
        "static/client/themes/" + theme + "/public/dist/vendor-bundle.js",
        "static/client/themes/" + theme + "/public/dist/client-bundle.js"
    ];
    const prodBundles = [
        theme + "/js/highlight.min.js",
        theme + "/dist/vendor-bundle.min.js",
        theme + "/dist/client-bundle.min.js"
    ];
    const bundles = process.env.NODE_ENV === "dev" ? devBundles : prodBundles;

    const insertScript = script =>
        `<script type="text/javascript" src="${makeUrl(
            script
        )}" defer></script>`;

    const initialState = JSON.stringify(state); //.replace(/</g, "\\u003c");
    const scripts = bundles.map(bundle => insertScript(bundle));

    let styleLinks = "";

    if (process.env.NODE_ENV === "production") {
        let link1 = makeUrl([theme, "dist/client.min.css"]);
        let link2 = makeUrl([theme, "dist/common.min.css"]);

        styleLinks = `<link href="${link1}" rel="stylesheet"/>`;
        styleLinks += `<link href="${link2}" rel="stylesheet"/>`;
    }

    return `<html ${htmlAttrs}>
            <head>
                <meta charSet="UTF-8" />
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1"
                />
                ${metaTags}
                ${styleLinks}
                
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
