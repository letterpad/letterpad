import * as fs from "fs";
import * as path from "path";

import config from "../../../config";
import { fetchSettings } from "../../../api/fetchSettings";
import utils from "../../../shared/util";

const isProd = process.env.NODE_ENV === "production";
const isDev = !isProd;

const initialState = JSON.stringify({});
const host = config.ROOT_URL + config.BASE_NAME + "/";
// convert the bundles into <script ...></script>
const scripts = (theme: string) => utils.prepareScriptTags(getBundles(theme));
// get the styles only in production. for dev, it will be injected by webpack
const styleLinks = (theme: string) =>
  !isDev
    ? utils.prepareStyleTags(host + "admin/dist/" + theme + "/admin.min.css")
    : "";

export const getAdminContent = async (_req, res) => {
  let theme: string;

  if (config.NODE_ENV === "production") {
    const settings = await fetchSettings();
    theme = settings.theme;
  } else {
    theme = config.THEME;
  }
  // replace template variables with values and return the html markup
  const content = utils.templateEngine(getTemplate(), {
    ...config,
    STYLE_TAGS: styleLinks(theme),
    INITIAL_STATE: initialState,
    NODE_ENV: process.env.NODE_ENV,
    SCRIPT_TAGS: scripts(theme),
    FAVICON: "data:image/x-icon;,",
  });

  res.end(content);
};

function getBundles(theme: string) {
  const devBundles = [
    host + "static/src/public/js/hot-reload-bundle.js",
    host + "static/src/public/js/" + theme + "/vendor-bundle.js",
    host + "static/src/admin/public/dist/" + theme + "/admin-bundle.js",
  ];
  const prodBundles = [
    host + "js/" + theme + "/vendor-bundle.min.js",
    host + "admin/dist/" + theme + "/admin-bundle.min.js",
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
