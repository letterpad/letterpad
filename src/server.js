/**
 * Welcome to Letterpad!
 *
 * This is the initial file which is responsible to bootup the client and the admin-dashboard.
 *
 */
if (process.env.NODE_ENV === "dev") {
  require("@babel/register");
}
const env = require("node-env-file");
try {
  configureEnvironment();
} catch (e) {
  throw Error(
    "The `.env` does not exist. Did you forget to rename `.env.sample` to `.env` ?",
  );
}

const express = require("express");
const bodyParser = require("body-parser");
const config = require("./config/index.js");
// const compression = require("compression");
const adminServer = require("./admin/server");
const apiServer = require("./api/server");
const clientServerRendering = require("./client/server/serverRendering");
const dir = require("./shared/dir.js");

const app = express();

// This middleware will attempt to compress response bodies for all requests
// app.use(compression());
// Handle hot module replacement in dev mode
// We are not using webpack-dev-server.
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
            stats: {
              colors: true,
              hash: false,
              timings: true,
              chunks: false,
              chunkModules: false,
              modules: false,
            },
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

      // One-liner for current directory, ignores .dotfiles
      require("chokidar")
        .watch("api/**/*.js")
        .on("all", (event, path) => {
          delete require.cache[require("path").join(__dirname, path)];
          delete require.cache[
            require("path").join(__dirname, "/api/schema.js")
          ];
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

let base = "";
if (config.baseName.length > 0) {
  base = config.baseName;
}

// Take care of static assets. We will expose couple of folders here.

// Expose the root public folder.
app.use(base, express.static("src/public"));
app.use(base, express.static("dist/public"));

// Expose the admin/public folder.
app.use(base + "/admin/", express.static(__dirname + "/admin/public"));
app.use(base + "/admin/", express.static(__dirname + "/admin/public"));

// Expose the static folder for static site
app.use(base + "/static", express.static("letterpad-static"));

// Every theme has a public directory for its assets. So we need to expose that.
dir.getDirectories(__dirname + "/client/themes/").map(themePath => {
  // get the theme folder name
  const theme = themePath.split("/").pop(-1);
  // expose the public folder. This can be accessed as /theme-name/css/style.css
  // in dev mode, this is required.
  app.use(base + "/" + theme + "/", express.static(themePath + "/public"));
  // Also provide a way to access the client folder
  app.use(base + "/client/", express.static(themePath + "/public"));
});

// This is not being used. The intention was to allow a user to start a build from the dashboard.
// But that would mean that the production server should have all the devDependencies.
app.get("/build", (req, res) => {
  const webpack = require("webpack");
  const ProgressPlugin = require("webpack/lib/ProgressPlugin");
  const config = require("../webpack/webpack.config.prod.js");
  const compiler = webpack(config);

  compiler.apply(
    new ProgressPlugin(function(percentage, msg) {
      res.write(percentage * 100 + "%" + " >> " + msg + "\n");
    }),
  );

  compiler.run(function(err) {
    res.end();
  });
});

// start the admin dashboard and the client. Both use the same server, but its nice to separate them
adminServer.init(app);
clientServerRendering.init(app);
apiServer(app);
const server = app.listen(process.env.appPort, function() {
  const host = server.address().address;
  const port = server.address().port;
  console.log("Letterpad listening at http://%s:%s", host, port);
});

module.exports = server;

function configureEnvironment() {
  env(__dirname + "/../.env");
  // for heroku
  if (process.env.NODE_HOME === "/app/.heroku/node") {
    process.env.appPort = process.env.PORT;
  }
}
