const env = require("node-env-file");
env(__dirname + "/../../../.env");

const configs = require("../../config/db.config.ts");
let config;

if (Object.keys(configs).includes(process.env.NODE_ENV)) {
  config = configs[process.env.NODE_ENV];
} else {
  config = configs.dev;
}
console.log("This file was called from housekeeper");
module.exports = config;
