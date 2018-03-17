var fs = require("fs");
var path = require("path");
var webpack = require("webpack");
var FileNameReplacementPlugin = require("./FileNameReplacementPlugin");
var AfterBuild = require("./AfterBuildPlugin");
var _webpack = require("./webpack.config");

const clientConfig = args => {
    const config = Object.assign({}, _webpack.commonConfig, {
        entry: {
            THEME_VENDOR: [
                "babel-polyfill",
                "react",
                "react-dom",
                "redux",
                "react-apollo",
                "moment"
            ],
            THEME_NAME: [
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
            new FileNameReplacementPlugin("./", args.theme),
            new webpack.DefinePlugin({
                "process.env": {
                    NODE_ENV: JSON.stringify("dev")
                }
            })
        ],
        module: {
            rules: [..._webpack.cssLoaders, ..._webpack.otherLoaders]
        }
    });

    config.entry[args.theme] = config.entry.THEME_NAME;
    config.entry[args.theme + "-vendor"] = config.entry.THEME_VENDOR;

    delete config.entry.THEME_NAME;
    delete config.entry.THEME_VENDOR;

    return config;
};

const serverConfig = args => {
    const BUILD_PATH = path.join(__dirname, "../build");
    return Object.assign({}, _webpack.commonConfig, {
        target: "node",
        entry: ["babel-polyfill", path.join(__dirname, "../client/server.js")],
        output: {
            filename: args.theme + ".server.js",
            path: BUILD_PATH,
            library: "server",
            libraryTarget: "commonjs2"
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
            rules: [..._webpack.serverCssLoaders, ..._webpack.otherLoaders]
        }
    });
};
module.exports = function(env) {
    return [serverConfig(env), clientConfig(env)];
};
