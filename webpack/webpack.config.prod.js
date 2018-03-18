var path = require("path");
var webpack = require("webpack");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const MinifyPlugin = require("babel-minify-webpack-plugin");
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer")
    .BundleAnalyzerPlugin;
var FileNameReplacementPlugin = require("../utils/WebpackFileReplace");
var _webpack = require("./config");

const extractSass = new ExtractTextPlugin(
    "../../../../css/default/[name].min.css"
);

const clientConfig = Object.assign({}, _webpack.commonConfig, {
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
        admin: ["babel-polyfill", path.join(__dirname, "../admin/app")],
        client: ["babel-polyfill", path.join(__dirname, "../client/app")]
    },
    output: {
        path: path.join(__dirname, "../public/js/themes/default/prod"),
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
        new FileNameReplacementPlugin("extend"),
        extractSass
    ],
    module: {
        rules: [
            {
                test: /\.(png|woff|woff2|eot|ttf|svg)$/,
                loader: "url-loader?url=false"
            },
            {
                test: /\.js$/,
                use: {
                    loader: "babel-loader",
                    options: _webpack.babelOptions
                },
                include: path.join(__dirname, "../admin")
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
                    ],
                    publicPath: path.join(
                        __dirname,
                        "../public/css/default/prod"
                    )
                })
                // include: path.join(__dirname, "../public/scss")
            }
        ]
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
                NODE_ENV: JSON.stringify("production")
            }
        })
    ],
    module: {
        rules: [..._webpack.loaders]
    }
});

module.exports = [clientConfig, serverConfig];
