const configs = require("../../config/db.config");

let config;

if (Object.keys(configs).includes(process.env.NODE_ENV)) {
  config = configs[process.env.NODE_ENV];
} else {
  config = configs.dev;
}

module.exports = {
  storage: "data/" + config.database + ".sqlite",
  dialect: "sqlite",
};
