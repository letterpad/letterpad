const configDev = require("./config.dev.js");
const configProd = require("./config.prod.js");
let currentEnv =
    typeof window !== "undefined" ? window.NODE_ENV : process.env.NODE_ENV;

if (!currentEnv) currentEnv = "test";

const configFile =
    ["dev", "test"].indexOf(currentEnv) >= 0 ? configDev : configProd;

const config = {
    rootUrl: configFile.rootUrl,
    apiUrl: configFile.apiUrl,
    uploadUrl: configFile.uploadUrl,
    appPort: configFile.appPort,
    apiPort: configFile.apiPort,
    defaultTitle: "Untitled",
    defaultSlug: "story",
    adminPath: "/admin",
    itemsPerPage: 6,
    mediaPerPage: 20,
    baseName: configFile.baseName
};

module.exports = config;
