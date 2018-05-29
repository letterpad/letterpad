const { ApolloClient } = require("apollo-client");
const { ApolloLink } = require("apollo-link");
const { onError } = require("apollo-link-error");
const path = require("path");
const fetch = require("node-fetch");
const fs = require("fs");
const config = require("../config");
const { createHttpLink } = require("apollo-link-http");
const { InMemoryCache } = require("apollo-cache-inmemory");
const { makeUrl } = require("../shared/util");
const { GET_OPTIONS } = require("../shared/queries/Queries");

const errorLink = onError(({ networkError, graphQLErrors }) => {
    if (graphQLErrors) {
        graphQLErrors.map(({ message, locations, path }) =>
            console.log(
                `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
            )
        );
    }
    if (networkError) console.log(`[Network error]: ${networkError}`);
});

const httpLink = createHttpLink({
    uri: config.apiUrl,
    fetch
});

const link = ApolloLink.from([errorLink, httpLink]);

module.exports.init = app => {
    app.get("*", (req, res) => {
        const client = new ApolloClient({
            ssrMode: true,
            link: link,
            cache: new InMemoryCache()
        });

        try {
            client.query({ query: GET_OPTIONS }).then(settings => {
                let theme = settings.data.settings.filter(
                    item => item.option == "theme"
                )[0].value;
                // In dev mode if a theme is explicitly called, then use that
                if (process.env.theme && process.env.theme !== "") {
                    theme = process.env.theme;
                }
                let serverFile =
                    "./themes/" + theme + "/public/dist/server.node.js";
                const urlParams = Object.assign(
                    {},
                    getParams(req.originalUrl),
                    getParams(req.header("Referer"))
                );
                let previewTheme = false;

                if (urlParams && "theme" in urlParams) {
                    theme = urlParams.theme;
                    previewTheme = true;
                }

                if (previewTheme) {
                    const previewThemePath =
                        "./themes/" + theme + "/public/dist/server.node.js";
                    if (fs.existsSync(path.join(__dirname, previewThemePath))) {
                        serverFile = previewThemePath;
                    } else {
                        console.error(
                            "Server bundle for theme " + theme + " not found"
                        );
                    }
                }
                const server = require(serverFile).default;

                server(req, client, config).then(
                    ({ html, apolloState, head }) => {
                        res.end(getHtml(theme, html, apolloState, head));
                    }
                );
            });
        } catch (e) {
            console.log(`[Request error]: ${e.message}`);
        }
    });
};

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
        "static/public/js/vendor-bundle.js",
        "static/client/themes/" + theme + "/public/dist/client-bundle.js"
    ];
    const prodBundles = [
        theme + "/js/highlight.min.js",
        "/js/vendor-bundle.min.js",
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
        styleLinks = `<link href="${link1}" rel="stylesheet"/>`;
    }

    return `<html ${htmlAttrs}>
            <head>
                <meta charSet="UTF-8" />
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1"
                />
                <link rel="manifest" href=${config.baseName + "/manifest.json"}>
                ${metaTags}
                ${styleLinks}
                
            </head>
            <body>
                <div id="app">${html}</div>
                <script>
                    window.__APOLLO_STATE__=${initialState};
                    window.NODE_ENV = "${process.env.NODE_ENV}";
                    window.rootUrl="${process.env.rootUrl}";
                    window.apiUrl="${process.env.apiUrl}";
                    window.uploadUrl="${process.env.uploadUrl}";
                    window.appPort="${process.env.appPort}";
                    window.apiPort="${process.env.apiPort}";
                    window.baseName="${process.env.baseName}";
                </script>
                ${scripts.join("")}
            </body>
        </html>`;
}
