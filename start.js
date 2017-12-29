require.extensions[".sass"] = () => "";
require.extensions[".scss"] = () => "";

require("babel-register");
require("babel-polyfill");
require("./api/server");
const express = require("express");
const bodyParser = require("body-parser");
const webpack = require("webpack");

const adminServerRendering = require("./app/serverRendering");
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
app.use(
    require("webpack-dev-middleware")(compiler, {
        noInfo: true,
        publicPath: webpackConfig.output.publicPath
    })
);

app.use(require("webpack-hot-middleware")(compiler));

let pinger = null;

app.get("/build", (req, res) => {
    // console.log("reached");
    // if (pinger !== null) {
    //     console.log("Ending");
    //     pinger.end();
    // }
    // console.log("Continuing");
    // pinger = Object.assign({}, res);
    var webpack = require("webpack");
    var ProgressPlugin = require("webpack/lib/ProgressPlugin");
    var config = require("./webpack.config.prod.js");
    var compiler = webpack(config);
    compiler.apply(
        new ProgressPlugin(function(percentage, msg) {
            res.write(percentage * 100 + "%" + " >> " + msg + "\n");
            //console.log(percentage * 100 + "%", msg);
        })
    );

    compiler.run(function(err, stats) {
        // ...
        res.end();
    });
});
adminServerRendering.init(app);
clientServerRendering.init(app);

app.listen(4040, () => {
    console.log("====> Admin is listening on", 4040);
});
