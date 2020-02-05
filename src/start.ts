if (process.env.NODE_ENV !== "production") {
  require("@babel/register");
  require("@babel/polyfill/noConflict");
  require("ts-node").register({});
}
require("./server");
