const merge = require("webpack-merge");
const baseConfig = require("./webpack.base.js");
const path = require("path");
const fs = require("fs");
const webpack = require("webpack");

const clientConfig = args => {
    if (args.theme == "") {
        args.theme = "letterpad";
    }
    return merge(baseConfig(args), {
        devtool: "eval-source-map",
        output: {
            filename: "[name]-bundle.js",
            publicPath: "/static/"
        },
        module: {
            rules: [
                {
                    test: /\.(png|woff|woff2|eot|ttf|svg)$/,
                    loader: "url-loader?url=false"
                },
                {
                    test: /\.(css|scss)$/,
                    use: [
                        "style-loader",
                        {
                            loader: "css-loader",
                            options: { importLoaders: 1 }
                        },
                        "postcss-loader"
                    ]

                    // include: [
                    //     path.join(__dirname, "../client/themes/" + args.theme)
                    // ]
                }
            ]
        }
    });
};

const serverConfig = args => {
    if (args.theme == "") {
        args.theme = "letterpad";
    }
    const BUILD_PATH = path.join(__dirname, "../build");

    const getExternals = () => {
        const nodeModules = {};
        fs
            .readdirSync("node_modules")
            .filter(function(x) {
                return [".bin"].indexOf(x) === -1;
            })
            .forEach(function(mod) {
                nodeModules[mod] = "commonjs " + mod;
            });
        return nodeModules;
    };
    return merge(baseConfig(args), {
        target: "node",
        entry: ["babel-polyfill", path.join(__dirname, "../client/server")],
        output: {
            filename: args.theme + ".node.js",
            path: BUILD_PATH,
            library: "server",
            libraryTarget: "commonjs2",
            hotUpdateChunkFilename: "../hot/hot-update.js",
            hotUpdateMainFilename: "../hot/hot-update.json"
        },
        externals: getExternals(),
        module: {
            rules: [
                {
                    test: /\.(png|woff|woff2|eot|ttf|svg)$/,
                    loader: "url-loader?url=false"
                },
                {
                    test: /\.(scss|css)$/,
                    use: ["css-loader/locals"]
                }
            ]
        }
    });
};

module.exports = args => [serverConfig(args), clientConfig(args)];
