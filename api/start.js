var env = require("node-env-file");
env(__dirname + "/../.env");
require("babel-register");
require("babel-polyfill");
require("./server");
