// require.extensions[".sass"] = () => "";
// require.extensions[".scss"] = () => "";
// require.extensions[".css"] = () => "";
const env = require("node-env-file");
env(__dirname + "/.env");
const express = require("express");
const bodyParser = require("body-parser");
const config = require("./config/index.js");
const compression = require("compression");
const adminServerRendering = require("./admin/serverRendering");
const clientServerRendering = require("./client/serverRendering");
const FileNameReplacementPlugin = require("./webpack/FileNameReplacementPlugin");
const dir = require("./shared/dir.js");

const app = express();

app.use(compression());

if (process.env.NODE_ENV === "dev") {
    console.log("hello");
    const wpConfigFile = "./webpack/webpack.dev.js";
    const webpackConfig = require(wpConfigFile)({
        theme: process.env.THEME || "amun"
    })[1];
    const compiler = require("webpack")(webpackConfig);
    const webpackDevMiddleware = require("webpack-dev-middleware");
    const webpackHotMiddleware = require("webpack-hot-middleware");

    app.use(
        webpackDevMiddleware(compiler, {
            hot: true,
            noInfo: true,
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
            heartbeat: 10 * 1000
        })
    );
}

app.use(bodyParser.json());
app.use(
    bodyParser.urlencoded({
        extended: true
    })
);

app.use(config.baseName, express.static("public"));
app.use(config.baseName + "admin/", express.static("admin/public"));
dir.getDirectories(__dirname + "/client/themes/").map(themePath => {
    const theme = themePath.split("/").pop(-1);
    app.use(
        config.baseName + theme + "/",
        express.static(themePath + "/public")
    );
});

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

    compiler.run(function(err, stats) {
        res.end();
    });
});

adminServerRendering.init(app);
clientServerRendering.init(app);

setTimeout(_ => {
    const server = app.listen(config.appPort, function() {
        const host = server.address().address;
        const port = server.address().port;

        console.log("Letterpad listening at http://%s:%s", host, port);
    });
}, 3000);
