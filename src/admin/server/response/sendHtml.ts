import * as fs from "fs";
import * as path from "path";

import config from "../../../config";
import utils from "../../../shared/util";

const isProd = process.env.NODE_ENV === "production";
const isDev = !isProd;

const initialState = JSON.stringify({});

// convert the bundles into <script ...></script>
const scripts = utils.prepareScriptTags(getBundles());
// get the styles only in production. for dev, it will be injected by webpack
const styleLinks = !isDev
  ? utils.prepareStyleTags("admin/dist/admin.min.css")
  : "";

export const getHtml = (_req, res) => {
  // replace template variables with values and return the html markup
  const content = utils.templateEngine(getTemplate(), {
    ...config,
    STYLE_TAGS: styleLinks,
    INITIAL_STATE: initialState,
    NODE_ENV: process.env.NODE_ENV,
    SCRIPT_TAGS: scripts,
  });

  res.end(content);
};

function getBundles() {
  const host = config.ROOT_URL + config.BASE_NAME + "/";
  const devBundles = [
    host + "static/hot-reload-bundle.js",
    host + "static/src/public/js/vendor-bundle.js",
    host + "static/src/admin/public/dist/admin-bundle.js",
  ];
  const prodBundles = [
    host + "js/vendor-bundle.min.js",
    host + "admin/dist/admin-bundle.min.js",
  ];
  return isDev ? devBundles : prodBundles;
}

function getTemplate() {
  // read the template buffer
  const templateBuffer = fs.readFileSync(
    path.resolve(__dirname, "./content.tpl"),
  );

  return templateBuffer.toString();
}
