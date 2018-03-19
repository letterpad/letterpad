const merge = require("webpack-merge");
const baseConfig = require("./webpack.base.js");
const path = require("path");
const fs = require("fs");
const webpack = require("webpack");
const ExtractTextPlugin = require("extract-text-webpack-plugin");

const clientConfig = args => {
    const extractSass = new ExtractTextPlugin(
        "../../../../css/" + args.theme + "/[name].min.css"
    );
    return merge(baseConfig(args), {
        output: {
            path: path.join(__dirname, "../public/js/themes/" + args.theme),
            filename: "[name]-bundle.min.js"
        },
        plugins: [new MinifyPlugin(), extractSass],
        module: {
            rules: [
                {
                    test: /\.(png|woff|woff2|eot|ttf|svg)$/,
                    loader: "url-loader?url=false"
                },
                {
                    test: /\.(css|scss)$/,
                    use: extractSass.extract({
                        fallback: "style-loader",
                        use: [
                            {
                                loader: "css-loader",
                                options: { importLoaders: 1, minimize: true }
                            },
                            "postcss-loader"
                        ]
                    })
                }
            ]
        }
    });
};

const serverConfig = args => {
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
