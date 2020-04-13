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
const noop = () => undefined;
require.extensions[".css"] = noop;
require.extensions[".svg"] = noop;

import { AddressInfo } from "net";
import adminServer from "./admin/server";
import apiServer from "./api/server";
import clientServerRendering from "./client/server/serverRendering";
import express from "express";
import middlewares from "./middlewares";
import staticPaths from "./staticPaths";

const app = express();
middlewares(app);
// Take care of static assets.
staticPaths(app);

// start the admin dashboard and the client. Both use the same server, but its nice to separate them
apiServer(app);
adminServer(app);
clientServerRendering(app);

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
