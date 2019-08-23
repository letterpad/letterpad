/**
 * This file is not going to render in the server. For admin dashboard we dont need server sided rendering
 * All code in ES5 for this file.
 */
const config = require("../config");
const {
  generateStaticAssets,
  createPullRequest,
} = require("./static-generator");
const { GET_OPTIONS, IS_AUTHORIZED } = require("../shared/queries/Queries");
const { getDirectories } = require("../shared/dir");
const path = require("path");
const fs = require("fs");
const {
  prepareScriptTags,
  prepareStyleTags,
  templateEngine,
} = require("../shared/util");
const { syncThemeSettings } = require("./util");
const client = require("../shared/apolloClient").default;

const clientOpts = {
  ssrMode: false,
  fetchPolicy: "no-cache",
};
module.exports.init = app => {
  app.get(config.baseName + "/admin/generate-static-site", (req, res) => {
    return client(true, req.headers.token, clientOpts)
      .query({ query: IS_AUTHORIZED })
      .then(auth => {
        if (auth.data.validateToken) {
          return generateStaticAssets(req, res);
        }
      })
      .catch(e => {
        return res.send(e);
      });
  });
  app.get(config.baseName + "/admin/create-pull-request", (req, res) => {
    return client(true, req.headers.token, clientOpts)
      .query({ query: IS_AUTHORIZED })
      .then(auth => {
        if (auth.data.validateToken) {
          return createPullRequest(req, res);
        }
      })
      .catch(e => {
        return res.send(e);
      });
  });

  app.get(config.baseName + "/admin/getThemes", (req, res) => {
    client()
      .query({ query: GET_OPTIONS })
      .then(settings => {
        let themeName = settings.data.settings.filter(
          item => item.option == "theme",
        )[0].value;
        const availableThemes = [];
        const newSettings = [];
        // Get all the folders inside the "themes" folder. Check if each
        // of those folder has a "config.json" file. If found, we will assume that
        // as a valid theme.
        getDirectories(path.join(__dirname, "../client/themes/")).map(
          themePath => {
            if (fs.existsSync(themePath + "/config.json")) {
              // delete cache to get updated file
              delete require.cache[require.resolve(themePath + "/config.json")];
              // get all the contents from the "config" file.
              const contents = require(themePath + "/config.json");
              const themeConfig = Object.assign({}, contents);
              const folder_name = themePath.split("/").pop(-1);
              // check if it has a thumbnail without http
              if (themeConfig.thumbnail.indexOf("http") === -1) {
                themeConfig.thumbnail =
                  config.baseName + "/" + folder_name + themeConfig.thumbnail;
              }
              // check the theme has settings
              const hasSettings = fs.existsSync(themePath + "/settings.json");

              themeConfig.active = themeConfig.short_name === themeName;
              themeConfig.settings = hasSettings;
              availableThemes.push(themeConfig);
              // get default settings of all themes from files
              if (hasSettings) {
                // we need to delete the cache, to get updated settings file
                delete require.cache[
                  require.resolve(themePath + "/settings.json")
                ];
                const defaultSettings = require(themePath + "/settings.json");
                const values = {};
                defaultSettings.forEach(field => {
                  values[field.name] = field.defaultValue;
                });
                newSettings.push({
                  name: themeConfig.short_name,
                  value: JSON.stringify(values),
                  settings: JSON.stringify(defaultSettings),
                });
              }
            }
          },
        );

        // If the theme developer has changed the settings of the theme,
        // it has to sync with the database.
        syncThemeSettings(client, newSettings, req.headers.authorization).then(
          () => {
            res.send(availableThemes);
          },
        );
      })
      .catch(e => {
        console.log(e);
      });
  });
  app.get(config.baseName + "/admin/*", (req, res) => {
    let apolloState = {};
    const content = getHtml(apolloState);
    res.end(content);
  });
};

function getHtml(apolloState) {
  const isDev = process.env.NODE_ENV === "dev";

  const devBundles = [
    "/static/public/js/vendor-bundle.js",
    "/static/admin/public/dist/admin-bundle.js",
  ];
  const prodBundles = [
    "/js/vendor-bundle.min.js",
    "/admin/dist/admin-bundle.min.js",
  ];
  const bundles = isDev ? devBundles : prodBundles;

  const initialState = JSON.stringify(apolloState);

  // convert the bundles into <script ...></script>
  const scripts = prepareScriptTags(bundles);

  // get the styles only in production. for dev, it will be injected by webpack
  const styleLinks = !isDev ? prepareStyleTags("admin/dist/admin.min.css") : "";

  // read the template buffer
  const templateBuffer = fs.readFileSync(
    path.resolve(__dirname, "./content.tpl"),
  );

  let template = templateBuffer.toString();

  // replace template variables with values and return the html markup
  return templateEngine(template, {
    STYLE_TAGS: styleLinks,
    INITIAL_STATE: initialState,
    NODE_ENV: process.env.NODE_ENV,
    ROOT_URL: process.env.rootUrl,
    API_URL: process.env.rootUrl + "/graphql",
    UPLOAD_URL: process.env.rootUrl + "/upload",
    APP_PORT: process.env.appPort,
    BASE_NAME: process.env.baseName,
    SCRIPT_TAGS: scripts,
  });
}
