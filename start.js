require.extensions[".sass"] = () => {
    return "";
};

require.extensions[".scss"] = () => {
    return "";
};
require("babel-register");
require("./api/server");
let express = require("express");
let config = require("./config/config");
let bodyParser = require("body-parser");
let adminServerRendering = require("./app/serverRendering");
let clientServerRendering = require("./client/serverRendering");
const app = express();
app.use(bodyParser.json());
app.use(
    bodyParser.urlencoded({
        extended: true
    })
);

app.use(express.static("public"));
// start a webpack-dev-server
var webpack = require("webpack");
var wpConfigFile = process.env.NODE_ENV == "dev"
    ? "./webpack.config.dev.js"
    : "./webpack.config.prod.js";
var webpackConfig = require(wpConfigFile);
var compiler = webpack(webpackConfig);
app.use(
    require("webpack-dev-middleware")(compiler, {
        noInfo: true,
        publicPath: webpackConfig.output.publicPath
    })
);
app.use(require("webpack-hot-middleware")(compiler));
adminServerRendering.init(app);
clientServerRendering.init(app);
app.listen(4040, function() {
    console.log("====> Admin is listening on", 4040);
});
