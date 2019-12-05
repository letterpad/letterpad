import { IThemeConfig } from "../../types/types";
/**
 * This file is not going to render in the server. For admin dashboard we dont need server sided rendering
 * All code in ES5 for this file.
 */
import config from "../../config";
import { generateStaticAssets, createPullRequest } from "./static-generator";
import { GET_OPTIONS, IS_AUTHORIZED } from "../../shared/queries/Queries";
import { getDirectories } from "../../shared/dir";
import path from "path";
import fs from "fs";
import utils from "../../shared/util";
import { syncThemeSettings } from "./util";
import client from "../../shared/apolloClient";

const clientOpts = {
  ssrMode: false,
  fetchPolicy: "no-cache",
};

const themesDir = path.join(__dirname, "../../client/themes/");

export default app => {
  app.get(config.baseName + "/admin/generate-static-site", (req, res) => {
    return client(true, clientOpts, req.headers.token)
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
    return client(true, clientOpts, req.headers.token)
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
        const availableThemes: Array<IThemeConfig> = [];
        const newSettings: Array<object> = [];
        // Get all the folders inside the "themes" folder. Check if each
        // of those folder has a "config.json" file. If found, we will assume that
        // as a valid theme.
        getDirectories(themesDir).map(themePath => {
          if (fs.existsSync(themePath + "/config.json")) {
            // delete cache to get updated file
            delete require.cache[require.resolve(themePath + "/config.json")];
            // get all the contents from the "config" file.
            const contents = require(themePath + "/config.json");
            const themeConfig: IThemeConfig = Object.assign({}, contents);
            const folder_name = themePath.split("/").pop();
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
        });
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
  app.get(config.baseName + "/admin/*", (_req, res) => {
    let apolloState = {};
    const content = getHtml(apolloState);
    res.end(content);
  });
};

function getHtml(apolloState) {
  const isProd = process.env.NODE_ENV === "production";
  const isDev = !isProd;

  const devBundles = [
    "/static/hot-reload-bundle.js",
    "/static/src/public/js/vendor-bundle.js",
    "/static/src/admin/public/dist/admin-bundle.js",
  ];
  const prodBundles = [
    "/js/vendor-bundle.min.js",
    "/admin/dist/admin-bundle.min.js",
  ];
  const bundles = isDev ? devBundles : prodBundles;

  const initialState = JSON.stringify(apolloState);

  // convert the bundles into <script ...></script>
  const scripts = utils.prepareScriptTags(bundles);
  // get the styles only in production. for dev, it will be injected by webpack
  const styleLinks = !isDev
    ? utils.prepareStyleTags("admin/dist/admin.min.css")
    : "";

  // read the template buffer
  const templateBuffer = fs.readFileSync(
    path.resolve(__dirname, "./content.tpl"),
  );

  let template = templateBuffer.toString();

  // replace template variables with values and return the html markup
  return utils.templateEngine(template, {
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
