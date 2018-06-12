"use strict";

var config = require("../../config");

var constants = {
    SECRET: process.env.SECRET_KEY,
    LOGIN_URL: config.baseName + "/admin/login"
};

module.exports = constants;