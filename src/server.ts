/**
 * Welcome to Letterpad!
 *
 * This is the initial file which is responsible to bootup the client and the admin-dashboard.
 *
 */

const env = require("node-env-file");
try {
  configureEnvironment();
} catch (e) {
  throw Error(
    "The `.env` does not exist. Did you forget to rename `.env.sample` to `.env` ?",
  );
}

import { AddressInfo } from "net";
import adminServer from "./admin/server";
import apiServer from "./api/server";
import bodyParser from "body-parser";
import clientServerRendering from "./client/server/serverRendering";
import { conn } from "./api/models";
import express from "express";
import staticPaths from "./staticPaths";

const app = express();

// Handle hot module replacement in dev mode. This is not working
if (process.env.NODE_ENV === "dev") {
  const wpConfigFile = "../webpack/webpack.dev.js";
  require(wpConfigFile)({
    theme: process.env.theme || "hugo",
  }).map(webpackConfig => {
    if (webpackConfig.name === "client") {
      const compiler = require("webpack")(webpackConfig);
      const webpackDevMiddleware = require("webpack-dev-middleware");
      const webpackHotMiddleware = require("webpack-hot-middleware");
      app
        .use(
          webpackDevMiddleware(compiler, {
            noInfo: true,
            hot: true,
            publicPath: webpackConfig.output.publicPath,
            stats: "errors-only",
            historyApiFallback: true,
          }),
        )
        .use(
          webpackHotMiddleware(compiler, {
            log: console.log,
            path: "/__webpack_hmr",
            heartbeat: 200,
          }),
        );
      // To take care of server sided rendering, we either have to restart the server
      // or delete the cache. After webpack has rebuild the bundles with the new change, we clear the cache
      // so that in the next request, node can read the new files instead of the cached ones.
      compiler.plugin("done", function() {
        console.log("Clearing /server/ module cache from server");
        Object.keys(require.cache).forEach(function(id) {
          if (/server.node./.test(id)) {
            delete require.cache[id];
            console.log("Deleted cache:", id);
          }
        });
      });
    }
  });
}

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  }),
);

// Take care of static assets.
staticPaths(app);

// start the admin dashboard and the client. Both use the same server, but its nice to separate them
adminServer(app);
clientServerRendering(app);
apiServer(app);

const server = app.listen(process.env.APP_PORT, function() {
  const addressInfo = server.address() as AddressInfo;
  const host = addressInfo.address;
  const port = addressInfo.port;
  console.log("Letterpad listening at http://%s:%s", host, port);
});

module.exports = server;

function configureEnvironment() {
  env(__dirname + "/../.env");
  // Heroku automatically starts the node server with the port defined
  // in the environment variable.
  if (process.env.NODE_HOME === "/app/.heroku/node") {
    process.env.APP_PORT = process.env.PORT;
  }
}
