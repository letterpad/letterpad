const configDev = require("./config.dev.js");
const configProd = require("./config.prod.js");
const currentEnv =
    "undefined" !== typeof window ? window.NODE_ENV : process.env.NODE_ENV;

const configFile = currentEnv === "dev" ? configDev : configProd;

const config = new function(configFile) {
    this.rootUrl = configFile.rootUrl;
    this.apiUrl = configFile.apiUrl;
    this.uploadUrl = configFile.uploadUrl;
    this.appPort = configFile.appPort;
    this.apiPort = configFile.apiPort;
    this.defaultTitle = "Untitled";
    this.defaultSlug = "ajaxtown";
    this.adminPath = "/admin";
    this.itemsPerPage = 6;
    this.baseName = configFile.baseName;
}(configFile);

module.exports = config;
