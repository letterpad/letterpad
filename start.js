require.extensions[".sass"] = () => "";
require.extensions[".scss"] = () => "";

require("babel-register");
require("babel-polyfill");
const express = require("express");
const bodyParser = require("body-parser");
const webpack = require("webpack");
const webpackDevMiddleware = require("webpack-dev-middleware");
const webpackHotMiddleware = require("webpack-hot-middleware");

const adminServerRendering = require("./admin/serverRendering");
const clientServerRendering = require("./client/serverRendering");

const wpConfigFile =
    process.env.NODE_ENV === "dev"
        ? "./webpack.config.dev.js"
        : "./webpack.config.prod.js";

const webpackConfig = require(wpConfigFile);
const app = express();

app.use(bodyParser.json());
app.use(
    bodyParser.urlencoded({
        extended: true
    })
);

app.use(express.static("public"));
// start a webpack-dev-server

const compiler = webpack(webpackConfig);

// let pinger = null;

// app.get("/build", (req, res) => {
//     // console.log("reached");
//     // if (pinger !== null) {
//     //     console.log("Ending");
//     //     pinger.end();
//     // }
//     // console.log("Continuing");
//     // pinger = Object.assign({}, res);
//     var webpack = require("webpack");
//     var ProgressPlugin = require("webpack/lib/ProgressPlugin");
//     var config = require("./webpack.config.prod.js");
//     var compiler = webpack(config);
//     compiler.apply(
//         new ProgressPlugin(function(percentage, msg) {
//             res.write(percentage * 100 + "%" + " >> " + msg + "\n");
//             //console.log(percentage * 100 + "%", msg);
//         })
//     );

//     compiler.run(function(err, stats) {
//         // ...
//         res.end();
//     });
// });
app.use(
    webpackDevMiddleware(compiler, {
        hot: true,
        noInfo: true,
        publicPath: webpackConfig.output.publicPath,
        stats: {
            colors: true
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
adminServerRendering.init(app);
clientServerRendering.init(app);

const server = app.listen(4040, function() {
    const host = server.address().address;
    const port = server.address().port;

    console.log("Example app listening at http://%s:%s", host, port);
});
