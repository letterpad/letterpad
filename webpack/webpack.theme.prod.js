const merge = require("webpack-merge");
const baseConfig = require("./webpack.base.js");
const path = require("path");
const fs = require("fs");
const webpack = require("webpack");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const MinifyPlugin = require("babel-minify-webpack-plugin");

const clientConfig = args => {
    if (typeof args.theme === "undefined") {
        throw new Error("Please provide a theme to build");
    }
    const extractPcss = new ExtractTextPlugin("[name].min.css");
    //const extractPcssAdmin = new ExtractTextPlugin("[name].min.css");
    const config = merge(baseConfig(args), {
        target: "web",
        output: {
            path: path.join(__dirname, "../"),
            filename: "[name]-bundle.min.js"
        },
        plugins: [extractPcss],
        module: {
            rules: [
                {
                    test: /\.(css|pcss)$/,
                    use: extractPcss.extract({
                        fallback: "style-loader",
                        use: [
                            {
                                loader: "css-loader",
                                options: {
                                    importLoaders: 1,
                                    minimize: true,
                                    url: false
                                }
                            },
                            "postcss-loader"
                        ]
                    }),
                    include: [
                        path.join(__dirname, "../client/themes/" + args.theme)
                    ]
                }
            ]
        }
    });
    config.entry = {
        ["client/themes/" + args.theme + "/public/dist/client"]: [
            path.join(__dirname, "../client/app")
        ]
    };
    return config;
};

const serverConfig = args => {
    if (args.theme == "") {
        args.theme = "amun";
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
        target: "node",

        output: {
            filename: "server.node.js",
            path: BUILD_PATH,
            library: "server",
            libraryTarget: "commonjs2"
        },
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
        externals: getExternals(),
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
