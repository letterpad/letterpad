require("@babel/polyfill");
require("@babel/register")({
  plugins: ["@babel/plugin-syntax-dynamic-import"],
  presets: [["@babel/env"]],
});
module.exports = require("./server.js");
