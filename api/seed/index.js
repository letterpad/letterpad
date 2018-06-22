require("babel-register");
require("babel-polyfill");
var env = require("node-env-file");
env(__dirname + "/../../.env");
const models = require("../../api/models/index.js");
const { seed } = require("./seed");
seed(models);
