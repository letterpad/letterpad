require("@babel/polyfill/noConflict");

const start = require("./start");
module.exports = app => {
  start(app);
};
