const config = require("../../config");

const constants = {
    SECRET: process.env.SECRET_KEY,
    LOGIN_URL: config.baseName + "/admin/login"
};

module.exports = constants;
