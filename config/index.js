const configDev = require("./config.dev.js");
const configProd = require("./config.prod.js");
const currentEnv =
    typeof window !== "undefined" ? window.NODE_ENV : process.env.NODE_ENV;

const configFile = currentEnv === "dev" ? configDev : configProd;

const config = {
    rootUrl: configFile.rootUrl,
    apiUrl: configFile.apiUrl,
    uploadUrl: configFile.uploadUrl,
    appPort: configFile.appPort,
    apiPort: configFile.apiPort,
    defaultTitle: "Untitled",
    defaultSlug: "letterpad",
    adminPath: "/admin",
    itemsPerPage: 6,
    baseName: configFile.baseName
};

module.exports = config;
