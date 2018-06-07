const { createHttpLink } = require("apollo-link-http");
const { InMemoryCache } = require("apollo-cache-inmemory");
const fetch = require("node-fetch");
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
                            const themeConfig = require(themePath +
                                "/config.json");
                            const details = Object.assign({}, themeConfig);
                            const name = themePath.split("/").pop(-1);
                            if (details.thumbnail.indexOf("http") === -1) {
                                details.thumbnail =
                                    config.baseName +
                                    "/" +
                                    name +
                                    details.thumbnail;
                            }
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
        client()
            .query({ query: GET_OPTIONS })
            .then(settings => {
                let theme = settings.data.settings.filter(
                    item => item.option == "theme"
                )[0].value;

                // In dev mode if a theme is explicitly called, then use that
                if (process.env.theme && process.env.theme !== "") {
                    theme = process.env.theme;
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

function Html({ initialState }) {
    const devBundles = [
        "/admin/js/highlight.min.js",
        "/admin/js/quill.1.2.2.js",
        "/static/public/js/vendor-bundle.js",
        "/static/admin/public/dist/admin-bundle.js"
    ];
    const prodBundles = [
        "/admin/js/highlight.min.js",
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
    const adminCss =
        process.env.NODE_ENV === "production"
            ? insertStyle("/dist/admin.min.css")
            : "";

    return `<html lang="en">
            <head>
                <meta charSet="UTF-8" />
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1"
                />
                <title>Letterpad</title>
                ${insertStyle("/css/bootstrap.min.css")}
                ${insertStyle("/css/vertical.css")}
                ${adminCss}
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
                <link
                    href="https://fonts.googleapis.com/css?family=Open+Sans:400,400italic,700"
                    rel="stylesheet"
                    type="text/css"
                />
                ${insertStyle("/css/font-awesome.min.css")}
                ${insertStyle("/css/quill.snow.css")}
                ${insertStyle("/css/github.min.css")}
                <script src="${
    config.baseName
}/admin/js/masonry.pkgd.min.js"></script>
                ${bundles.map(insertScript).join("")}
            </body>
        </html>`;
}
