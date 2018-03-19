import ApolloClient from "apollo-client";
import path from "path";
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
            let theme = settings.data.settings.filter(
                item => item.option == "theme"
            )[0].value;
            // In dev mode if a theme is explicitly called, then use that
            if (process.env.THEME !== "") {
                let theme = process.env.THEME;
            }
            let serverFile = "../build/" + theme + ".node";
            if (req.query.theme && req.query.theme !== "") {
                const previewTheme = "../build/" + req.query.theme + ".node";
                if (fs.existsSync(path.resolve(previewTheme))) {
                    serverFile = previewTheme;
                }
            }
            console.log("=====================", serverFile);
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
    // let devBundles = [
    //     "/js/highlight.min.js",
    //     "/js/themes/" + theme + "/dev/vendor-bundle.js",
    //     "/js/themes/" + theme + "/dev/client-bundle.js"
    // ];

    const prodBundles = [
        "/js/highlight.min.js",
        "/js/themes/" + theme + "/prod/vendor-bundle.min.js",
        "/js/themes/" + theme + "/prod/client-bundle.min.js"
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
                ${
                    process.env.NODE_ENV === "production"
                        ? '<link href="/css/${theme}/client.min.css" rel="stylesheet"/> \
                     <link href="/css/${theme}/custom.min.css" rel="stylesheet"/>'
                        : ""
                }
                
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
