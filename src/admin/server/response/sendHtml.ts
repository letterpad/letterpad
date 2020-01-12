import * as path from "path";
import * as fs from "fs";
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

  res.end(content);
};

function getBundles() {
  const devBundles = [
    "/static/hot-reload-bundle.js",
    "/static/src/public/js/vendor-bundle.js",
    "/static/src/admin/public/dist/admin-bundle.js",
  ];
  const prodBundles = [
    "/js/vendor-bundle.min.js",
    "/admin/dist/admin-bundle.min.js",
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
