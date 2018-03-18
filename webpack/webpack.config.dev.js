var path = require("path");
var webpack = require("webpack");
var FileNameReplacementPlugin = require("../utils/WebpackFileReplace");
var _webpack = require("./config");

const clientConfig = Object.assign({}, _webpack.commonConfig, {
    entry: {
        vendor: [
            "babel-polyfill",
            "react",
            "react-dom",
            "redux",
            "react-apollo",
            "moment"
        ],
        admin: [
            "babel-polyfill",
            "webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000",
            path.join(__dirname, "../admin/app")
        ],
        client: [
            "babel-polyfill",
            "webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000",
            path.join(__dirname, "../client/app")
        ]
    },
    output: {
        path: path.join(__dirname, "../dist"),
        filename: "[name]-bundle.js",
        publicPath: "/static/"
    },
    plugins: [
        ..._webpack.commonConfig.plugins,
        new FileNameReplacementPlugin("extend"),
        new webpack.DefinePlugin({
            "process.env": {
                NODE_ENV: JSON.stringify("dev")
            }
        })
    ],
    module: {
        rules: [..._webpack.loaders]
    }
});

const serverConfig = Object.assign({}, _webpack.commonConfig, {
    target: "node",
    entry: ["babel-polyfill", path.join(__dirname, "../client/server")],
    output: {
        filename: "default.server.js",
        path: path.join(__dirname, "../build"),
        library: "server",
        libraryTarget: "commonjs2"
    },
    externals: _webpack.nodeModules,
    plugins: [
        ..._webpack.commonConfig.plugins,
        new FileNameReplacementPlugin("extend"),
        new webpack.DefinePlugin({
            "process.env": {
                NODE_ENV: JSON.stringify("dev")
            }
        })
    ],
    module: {
        rules: [..._webpack.loaders]
    }
});

module.exports = [clientConfig, serverConfig];
