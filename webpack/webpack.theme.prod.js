var path = require("path");
var webpack = require("webpack");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const MinifyPlugin = require("babel-minify-webpack-plugin");
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer")
    .BundleAnalyzerPlugin;
var FileNameReplacementPlugin = require("./FileNameReplacementPlugin");
var AfterBuild = require("./AfterBuildPlugin");
var _webpack = require("./config");

const clientConfig = args => {
    const extractSass = new ExtractTextPlugin(
        "../../../../css/" + args.theme + "/[name].min.css"
    );
    const config = Object.assign({}, _webpack.commonConfig, {
        mode: "production",
        watch: false,
        devtool: "none",
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
                "../public/js/themes/" + args.theme + "/prod"
            ),
            filename: "[name]-bundle.min.js"
        },
        plugins: [
            ..._webpack.commonConfig.plugins,
            new BundleAnalyzerPlugin(),
            new webpack.optimize.OccurrenceOrderPlugin(),
            new webpack.DefinePlugin({
                "process.env": {
                    NODE_ENV: "'production'"
                }
            }),
            new webpack.ContextReplacementPlugin(/moment[/\\]locale$/, /en/),
            new MinifyPlugin(),
            new FileNameReplacementPlugin("./", args.theme),
            extractSass
        ],
        module: {
            rules: [
                {
                    test: /\.(png|woff|woff2|eot|ttf|svg)$/,
                    loader: "url-loader"
                },
                {
                    test: /\.js$/,
                    use: {
                        loader: "babel-loader",
                        options: _webpack.babelOptions
                    },
                    include: path.join(__dirname, "../client")
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

    return config;
};

const serverConfig = args => {
    const BUILD_PATH = path.join(__dirname, "../build");
    return Object.assign({}, _webpack.commonConfig, {
        watch: false,
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
