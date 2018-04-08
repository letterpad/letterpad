"use strict";

var configDev = require("./config.dev.js");
var configProd = require("./config.prod.js");
var env =
    "undefined" !== typeof window ? window.NODE_ENV : process.env.NODE_ENV;

var configFile = env === "dev" ? configDev : configProd;

var config = new function(configFile) {
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
