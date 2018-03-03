var path = require("path");
var webpack = require("webpack");
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer")
    .BundleAnalyzerPlugin;

module.exports = {
    devtool: "source-map",
    mode: "development",
    entry: {
        vendor: ["react", "react-dom", "redux", "react-apollo"],
        admin: [
            "babel-polyfill",
            "webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000",
            "./admin/app"
        ],
        client: [
            "babel-polyfill",
            "webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000",
            "./client/app"
        ]
    },
    output: {
        path: path.join(__dirname, "dist"),
        filename: "[name]-bundle.js",
        publicPath: "/static/"
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
        runtimeChunk: true
    },
    plugins: [
        new BundleAnalyzerPlugin(),
        new webpack.HotModuleReplacementPlugin(),
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
                loaders: ["style-loader", "css-loader"]
            },
            // {
            //     test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
            //     loader: "url-loader?limit=10000&mimetype=image/svg+xml"
            // },
            {
                test: /\.(png|woff|woff2|eot|ttf|svg)$/,
                loader: "url-loader?limit=100000"
            },
            // CSS
            {
                test: /\.scss$/,
                loaders: [
                    "style-loader",
                    "css-loader?sourceMap",
                    "sass-loader?sourceMap"
                ],
                include: /public/,
                exclude: /node_modules/
            },
            // js
            {
                test: /\.js$/,
                loaders: ["babel-loader"],
                include: path.join(__dirname, "admin")
            },
            {
                test: /\.js$/,
                loaders: ["babel-loader"],
                include: path.join(__dirname, "client")
            }
        ]
    }
};
