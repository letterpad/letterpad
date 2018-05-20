const ReactDOM = require("react-dom/server");
const { createHttpLink } = require("apollo-link-http");
const { InMemoryCache } = require("apollo-cache-inmemory");
const fetch = require("node-fetch");
const { StaticRouter } = require("react-router");
const { ApolloProvider, getDataFromTree } = require("react-apollo");
const { ApolloClient } = require("apollo-client");
const config = require("../config");
const { GET_OPTIONS } = require("../shared/queries/Queries");
const { getDirectories } = require("../shared/dir");
const path = require("path");
const fs = require("fs");
const { makeUrl } = require("../shared/util");

const client = () =>
    new ApolloClient({
        ssrMode: false,
        link: createHttpLink({
            uri: config.apiUrl,
            fetch
        }),
        cache: new InMemoryCache()
    });

module.exports.init = app => {
    app.get(config.baseName + "/admin/getThemes", (req, res) => {
        client()
            .query({ query: GET_OPTIONS })
            .then(settings => {
                let theme = settings.data.settings.filter(
                    item => item.option == "theme"
                )[0].value;
                const availableThemes = [];
                getDirectories(path.join(__dirname, "../client/themes/")).map(
                    themePath => {
                        if (fs.existsSync(themePath + "/config.json")) {
                            const details = require(themePath + "/config.json");
                            if (details.thumbnail.indexOf("http") === -1) {
                                details.thumbnail =
                                    config.baseName + details.thumbnail;
                            }
                            const name = themePath.split("/").pop(-1);
                            availableThemes.push({
                                details: Object.assign({}, details),
                                name: name,
                                active: name === theme
                            });
                        }
                    }
                );
                res.send(availableThemes);
            });
    });

    app.get(config.baseName + "/admin/*", (req, res) => {
        //const client = getClient();
        client()
            .query({ query: GET_OPTIONS })
            .then(settings => {
                let theme = settings.data.settings.filter(
                    item => item.option == "theme"
                )[0].value;

                // In dev mode if a theme is explicitly called, then use that
                if (process.env.THEME && process.env.THEME !== "") {
                    theme = process.env.THEME;
                }
                const sendResponse = ({ content, initialState }) => {
                    const html = Html({ theme, content, initialState });
                    res.status(200);
                    res.send(`<!doctype html>\n${html}`);
                    res.end();
                };
                let initialState = {};
                sendResponse({ content: null, initialState });
            });
    });
};

function Html({ theme, content, initialState }) {
    const devBundles = [
        "/admin/js/quill.1.2.2.js",
        "/static/public/js/vendor-bundle.js",
        "/static/admin/public/dist/admin-bundle.js"
    ];
    const prodBundles = [
        "/admin/js/quill.1.2.2.js",
        "/admin/dist/vendor-bundle.min.js",
        "/admin/dist/admin-bundle.min.js"
    ];
    const bundles =
        process.env.NODE_ENV === "production" ? prodBundles : devBundles;

    const insertScript = script =>
        `<script type="text/javascript" src="${makeUrl(
            script
        )}" defer></script>`;

    const insertStyle = style =>
        `<link
            href="${makeUrl(["admin", style])}"
            rel="stylesheet"
            type="text/css"
        />`;

    return `<html lang="en">
            <head>
                <meta charSet="UTF-8" />
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1"
                />
                <title>Letterpad</title>

                <link
                    href="https://fonts.googleapis.com/css?family=Open+Sans:400,400italic,700"
                    rel="stylesheet"
                    type="text/css"
                />
                ${insertStyle("/css/bootstrap.min.css")}
                ${insertStyle("/css/vertical.css")}
                ${insertStyle("/css/font-awesome.min.css")}
                <link
                    href="http://cdn.jsdelivr.net/highlight.js/9.8.0/styles/github.min.css"
                    rel="stylesheet"
                    type="text/css"
                />
                <link
                    href="https://cdn.quilljs.com/1.2.2/quill.snow.css"
                    rel="stylesheet"
                    type="text/css"
                />
                ${insertStyle("/dist/admin.min.css")}
            </head>
            <body>
                <div id="app"></div>
                <script>
                    window.NODE_ENV = "${process.env.NODE_ENV}";
                    window.__APOLLO_STATE__=${JSON.stringify(initialState)};
                    window.rootUrl = "${process.env.rootUrl}";
                    window.apiUrl="${process.env.apiUrl}";
                    window.uploadUrl="${process.env.uploadUrl}";
                    window.appPort="${process.env.appPort}";
                    window.apiPort="${process.env.apiPort}";
                    window.baseName="${process.env.baseName}";
                </script>
                ${insertScript("/admin/js/highlight.min.js")}
               
                ${bundles.map(bundle => insertScript(bundle))}
            </body>
        </html>`;
}
