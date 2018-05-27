const merge = require("webpack-merge");
const baseConfig = require("./webpack.base.js");
const path = require("path");
const fs = require("fs");
const webpack = require("webpack");

const clientConfig = args => {
    if (args.theme == "") {
        args.theme = "hugo";
    }
    return merge(baseConfig(args), {
        name: "client",
        devtool: "cheap-module-source-map",
        target: "web",
        entry: {
            "react-hot-loder": "react-hot-loader/patch"
        },
        output: {
            path: path.join(__dirname, "../"),
            filename: "[name]-bundle.js",
            publicPath: "/static/",
            hotUpdateChunkFilename: "public/hot/client-hot-update.js",
            hotUpdateMainFilename: "public/hot/client-hot-update.json"
        },
        watchOptions: {
            ignored: [/node_modules([\\]+|\/)+(?!\some_npm_module_name)/]
        },
        optimization: {
            minimize: false,
            runtimeChunk: {
                name: "public/js/vendor"
            },
            splitChunks: {
                cacheGroups: {
                    default: false,
                    commons: {
                        test: "public/js/vendor-bundle.js",
                        name: "public/js/vendor",
                        chunks: "all"
                    }
                }
            }
        },
        module: {
            rules: [
                {
                    test: /\.(png|woff|woff2|eot|ttf|svg)$/,
                    loader: "url-loader?url=false"
                },
                {
                    test: /\.(css|pcss)$/,
                    use: [
                        "style-loader",
                        {
                            loader: "css-loader",
                            options: { importLoaders: 1, sourceMap: 1 }
                        },
                        {
                            loader: "postcss-loader",
                            options: {
                                sourceMap: "inline"
                            }
                        }
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
        args.theme = "hugo";
    }
    const BUILD_PATH = path.join(
        __dirname,
        "../client/themes/" + args.theme + "/public/dist"
    );

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
    const config = merge(baseConfig(args), {
        name: "server",
        cache: true,
        target: "node",
        entry: {
            a: ["babel-polyfill", path.join(__dirname, "../client/server")]
        },
        output: {
            filename: "server.node.js",
            path: BUILD_PATH,
            library: "server",
            libraryTarget: "commonjs2",
            hotUpdateChunkFilename: "../public/hot/hot-update.js",
            hotUpdateMainFilename: "../public/hot/hot-update.json"
        },

        externals: getExternals(),
        plugins: [
            new webpack.DefinePlugin({
                "process.env": {
                    apiUrl: "process.env.apiUrl",
                    uploadUrl: "process.env.uploadUrl",
                    rootUrl: "process.env.rootUrl",
                    appPort: "process.env.appPort",
                    apiPort: "process.env.apiPort",
                    baseName: "process.env.baseName"
                }
            })
        ],
        module: {
            rules: [
                {
                    test: /\.(png|woff|woff2|eot|ttf|svg)$/,
                    loader: "url-loader?url=false"
                },
                {
                    test: /\.(pcss|css)$/,
                    use: ["css-loader/locals"]
                }
            ]
        }
    });
    config.entry = {
        server: ["babel-polyfill", path.join(__dirname, "../client/server")]
    };
    return config;
};

module.exports = args => [serverConfig(args), clientConfig(args)];
