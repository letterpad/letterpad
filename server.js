/**
 * Welcome to Letterpad!
 *
 * This is the initial file which is responsible to bootup the client and the admin-dashboard.
 *
 */
const env = require("node-env-file");
env(__dirname + "/.env");

const express = require("express");
const bodyParser = require("body-parser");
const config = require("./config/index.js");
const compression = require("compression");
const adminServer = require("./admin/server");
const clientServerRendering = require("./client/serverRendering");
const dir = require("./shared/dir.js");

const app = express();

// This middleware will attempt to compress response bodies for all requests
app.use(compression());
// Handle hot module replacement in dev mode
// We are not using webpack-dev-server.
if (process.env.NODE_ENV === "dev") {
    const wpConfigFile = "./webpack/webpack.dev.js";
    require(wpConfigFile)({
        theme: process.env.theme || "hugo"
    }).map(webpackConfig => {
        if (webpackConfig.name === "client") {
            const compiler = require("webpack")(webpackConfig);
            const webpackDevMiddleware = require("webpack-dev-middleware");
            const webpackHotMiddleware = require("webpack-hot-middleware");

            app.use(
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
                        modules: false
                    },
                    historyApiFallback: true
                })
            );

            app.use(
                webpackHotMiddleware(compiler, {
                    log: console.log,
                    path: "/__webpack_hmr",
                    heartbeat: 200
                })
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
        extended: true
    })
);

let base = "";
if (config.baseName.length > 0) {
    base = config.baseName;
}

// Take care of static assets. We will expose couple of folders here.

// Expose the root public folder.
app.use(base, express.static("public"));

// Expose the admin/public folder.
app.use(base + "/admin/", express.static("admin/public"));

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
    const config = require("./webpack.config.prod.js");
    const compiler = webpack(config);

    compiler.apply(
        new ProgressPlugin(function(percentage, msg) {
            res.write(percentage * 100 + "%" + " >> " + msg + "\n");
        })
    );

    compiler.run(function(err) {
        res.end();
    });
});

// start the admin dashboard and the client. Both use the same server, but its nice to separate them
adminServer.init(app);
clientServerRendering.init(app);

// add a timeout. We want the api server to run first and then the application server
setTimeout(() => {
    const server = app.listen(config.appPort, function() {
        const host = server.address().address;
        const port = server.address().port;
        console.log("Letterpad listening at http://%s:%s", host, port);
    });
}, 3000);
