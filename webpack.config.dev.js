var path = require("path");
var webpack = require("webpack");
var FileNameReplacementPlugin = require("./utils/WebpackFileReplace");

var babelOptions = {
    presets: [
        "react",
        [
            "env",
            {
                targets: {
                    browsers: ["last 2 versions", "safari >= 7"]
                },
                modules: false,
                useBuiltIns: false
            }
        ]
    ],

    plugins: ["transform-object-rest-spread"]
};

module.exports = {
    devtool: "source-map",
    mode: "development",
    entry: {
        vendor: [
            "./public/js/polyfill.js",
            "react",
            "react-dom",
            "redux",
            "react-apollo",
            "moment"
        ],
        admin: [
            "./public/js/polyfill.js",
            "webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000",
            "./admin/app"
        ],
        client: [
            "./public/js/polyfill.js",
            "webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000",
            "./client/app"
        ]
    },
    output: {
        path: path.join(__dirname, "dist"),
        filename: "[name]-bundle.js",
        publicPath: "/static/"
    },
    resolve: {
        alias: {
            admin: path.join(__dirname, "admin"),
            client: path.join(__dirname, "client"),
            shared: path.join(__dirname, "shared")
        },
        extensions: [".js"]
    },
    optimization: {
        splitChunks: {
            cacheGroups: {
                vendor: {
                    chunks: "initial",
                    name: "vendor",
                    test: "vendor",
                    enforce: true
                }
            }
        },
        runtimeChunk: false
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new FileNameReplacementPlugin("extend"),
        new webpack.NoEmitOnErrorsPlugin(),
        new webpack.DefinePlugin({
            "process.env": {
                NODE_ENV: JSON.stringify("dev")
            }
        })
    ],
    module: {
        rules: [
            {
                test: /\.css$/,
                use: ["style-loader", "css-loader"]
            },
            {
                test: /\.(png|woff|woff2|eot|ttf|svg)$/,
                loader: "url-loader?limit=100000"
            },
            // CSS
            {
                test: /\.scss$/,
                use: [
                    "style-loader",
                    "css-loader?sourceMap",
                    "sass-loader?sourceMap"
                ],
                exclude: /node_modules/
            },
            // js
            {
                test: /\.js$/,
                use: {
                    loader: "babel-loader",
                    options: babelOptions
                },
                include: path.join(__dirname, "admin")
            },
            {
                test: /\.js$/,
                use: {
                    loader: "babel-loader",
                    options: babelOptions
                },
                include: path.join(__dirname, "client")
            }
        ]
    }
};
