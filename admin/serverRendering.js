const { createHttpLink } = require("apollo-link-http");
const { InMemoryCache } = require("apollo-cache-inmemory");
const fetch = require("node-fetch");
const { ApolloClient } = require("apollo-client");
const config = require("../config");
const { GET_OPTIONS } = require("../shared/queries/Queries");
const { getDirectories } = require("../shared/dir");
const path = require("path");
const fs = require("fs");
const {
    getMetaTags,
    prepareScriptTags,
    prepareStyleTags,
    templateEngine
} = require("../shared/util");

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
                let apolloState = {};
                const content = getHtml(theme, content, apolloState, settings);
                res.end(content);
            });
    });
};

function getHtml(theme, html, apolloState, settings) {
    const isDev = process.env.NODE_ENV === "dev";

    const devBundles = [
        { src: "/admin/js/masonry.pkgd.min.js" },
        "/admin/js/highlight.min.js",
        "/admin/js/quill.1.2.2.js",
        "/static/public/js/vendor-bundle.js",
        "/static/admin/public/dist/admin-bundle.js"
    ];
    const prodBundles = [
        { src: "/admin/js/masonry.pkgd.min.js" },
        "/admin/js/highlight.min.js",
        "/admin/js/quill.1.2.2.js",
        "/admin/dist/vendor-bundle.min.js",
        "/admin/dist/admin-bundle.min.js"
    ];
    const bundles = isDev ? devBundles : prodBundles;

    const initialState = JSON.stringify(apolloState);

    // convert the bundles into <script ...></script>
    const scripts = prepareScriptTags(bundles);

    // get the styles only in production. for dev, it will be injected by webpack
    const styleLinks = !isDev
        ? prepareStyleTags("admin/dist/admin.min.css")
        : "";

    // read the template buffer
    const templateBuffer = fs.readFileSync(
        path.resolve(__dirname, "./content.tpl")
    );

    let template = templateBuffer.toString();

    // replace template variables with values and return the html markup
    return templateEngine(template, {
        STYLE_TAGS: styleLinks,
        INITIAL_STATE: initialState,
        NODE_ENV: process.env.NODE_ENV,
        ROOT_URL: process.env.rootUrl,
        API_URL: process.env.apiUrl,
        UPLOAD_URL: process.env.uploadUrl,
        APP_PORT: process.env.appPort,
        API_PORT: process.env.apiPort,
        BASE_NAME: process.env.baseName,
        SCRIPT_TAGS: scripts
    });
}
