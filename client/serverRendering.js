const { ApolloClient } = require("apollo-client");
const { ApolloLink } = require("apollo-link");
const { onError } = require("apollo-link-error");
const path = require("path");
const fetch = require("isomorphic-fetch");
const fs = require("fs");
const config = require("../config");
const { createHttpLink } = require("apollo-link-http");
const { InMemoryCache } = require("apollo-cache-inmemory");
const {
    getMetaTags,
    prepareScriptTags,
    prepareStyleTags,
    templateEngine,
    convertQueryToParams,
    _extends
} = require("../shared/util");

const { GET_OPTIONS } = require("../shared/queries/Queries");

// handle errors whie fetching data in the server.
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
        // using the apolloclient we can fetch data from the backend
        const client = new ApolloClient({
            ssrMode: true,
            link: link,
            cache: new InMemoryCache()
        });

        // get the settings data. It contains information about the theme that we want to render.
        client
            .query({ query: GET_OPTIONS })
            .then(options => {
                const settings = {};
                options.data.settings.forEach(item => {
                    settings[item.option] = item.value;
                });
                let theme = settings.theme;
                // In dev mode if a theme is explicitly called, then use that
                if (process.env.theme && process.env.theme !== "") {
                    theme = process.env.theme;
                }
                // Get the server file based on the appropriate theme
                let serverFile =
                    "./themes/" + theme + "/public/dist/server.node.js";

                // we also need a way to preview other themes. This works but not very well.
                // needs to be changed later.
                const urlParams = _extends(
                    {},
                    convertQueryToParams(req.originalUrl),
                    convertQueryToParams(req.header("Referer"))
                );

                // if its in preview mode, get the preview file. this will not work in dev mode
                // because at a time, only one theme is bundled
                serverFile = checkPreview(serverFile, theme, urlParams);

                if (!fs.existsSync(path.join(__dirname, serverFile))) {
                    res.end(
                        "Server file does not exist. Wait for the build to finish and try again after some time."
                    );
                    return false;
                }
                // this is the bundle file from server.js which returns a promise
                const server = require(serverFile).default;

                server(req, client, config)
                    .then(({ html, apolloState, head }) => {
                        const content = getHtml(
                            theme,
                            html,
                            apolloState,
                            head,
                            settings
                        );
                        res.end(content);
                    })
                    .catch(e => {
                        console.log("Error while rendering", e);
                    });
            })
            .catch(e => {
                console.log(e);
            });
    });
};

function getHtml(theme, html, state, head, settings) {
    const { htmlAttrs, metaTags } = getMetaTags(head);
    const isDev = process.env.NODE_ENV === "dev";

    let devBundles = [
        "static/public/js/vendor-bundle.js",
        "static/client/themes/" + theme + "/public/dist/client-bundle.js"
    ];
    const prodBundles = [
        "/js/vendor-bundle.min.js",
        theme + "/dist/client-bundle.min.js"
    ];
    const bundles = isDev ? devBundles : prodBundles;

    const initialState = JSON.stringify(state);

    // convert the bundles into <script ...></script>
    const scripts = prepareScriptTags(bundles);

    // get the styles only in production. for dev, it will be injected by webpack
    const styleLinks = !isDev
        ? prepareStyleTags(theme + "/dist/client.min.css")
        : "";

    // read the template buffer
    const templateBuffer = fs.readFileSync(
        path.resolve(__dirname, "./content.tpl")
    );

    let template = templateBuffer.toString();

    // replace template variables with values and return the html markup
    return templateEngine(template, {
        HTML_CONTENT: html,
        HTML_ATTRS: htmlAttrs,
        STYLE_TAGS: styleLinks,
        META_TAGS: metaTags,
        INITIAL_STATE: initialState,
        NODE_ENV: process.env.NODE_ENV,
        ROOT_URL: process.env.rootUrl,
        API_URL: process.env.apiUrl,
        UPLOAD_URL: process.env.uploadUrl,
        APP_PORT: process.env.appPort,
        API_PORT: process.env.apiPort,
        BASE_NAME: process.env.baseName,
        TRACKING_ID: settings.google_analytics,
        GA_SCRIPT_TAG:
            settings.google_analytics !== ""
                ? '<script async src="https://www.gogle-analytics.com/analytics.js"></script>'
                : "",
        SCRIPT_TAGS: scripts
    });
}

// if the url has a param ?theme=xxx, then use that theme
// this will not work in dev mode.
function checkPreview(serverFile, theme, urlParams) {
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
            console.error("Server bundle for theme " + theme + " not found");
        }
    }
    return serverFile;
}
