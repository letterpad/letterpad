var fs = require("fs");
var path = require("path");
var webpack = require("webpack");
var FileNameReplacementPlugin = require("./FileNameReplacementPlugin");
var AfterBuild = require("./AfterBuildPlugin");
var _webpack = require("./config");

const clientConfig = args => {
    const config = Object.assign({}, _webpack.commonConfig, {
        entry: {
            vendor: [
                "babel-polyfill",
                "react",
                "react-dom",
                "redux",
                "react-apollo",
                "moment"
            ],
            client: [
                "babel-polyfill",
                "webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000",
                path.join(__dirname, "../client/app")
            ]
        },
        output: {
            path: path.join(
                __dirname,
                "../public/js/themes/" + args.theme + "/dev"
            ),
            filename: "[name]-bundle.js",
            publicPath: "/static/",
            hotUpdateChunkFilename: "../hot/hot-update.js",
            hotUpdateMainFilename: "../hot/hot-update.json"
        },
        plugins: [
            ..._webpack.commonConfig.plugins,
            new FileNameReplacementPlugin("./", args.theme),
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

    return config;
};

const serverConfig = args => {
    const BUILD_PATH = path.join(__dirname, "../build");
    return Object.assign({}, _webpack.commonConfig, {
        target: "node",
        entry: ["babel-polyfill", path.join(__dirname, "../client/server.js")],
        output: {
            filename: args.theme + ".node.js",
            path: BUILD_PATH,
            library: "server",
            libraryTarget: "commonjs2",
            hotUpdateChunkFilename: "../hot/hot-update.js",
            hotUpdateMainFilename: "../hot/hot-update.json"
        },
        externals: _webpack.nodeModules,
        plugins: [
            ..._webpack.commonConfig.plugins,
            new FileNameReplacementPlugin("./", args.theme),
            // new AfterBuild(_ =>
            //     fs.unlink(BUILD_PATH + "/" + args.theme + ".server.js.map")
            // ),
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
};
module.exports = function(env) {
    return [serverConfig(env), clientConfig(env)];
};
