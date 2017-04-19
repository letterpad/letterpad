var path = require("path");
var webpack = require("webpack");
const ExtractTextPlugin = require("extract-text-webpack-plugin");

const extractSass = new ExtractTextPlugin({
    filename: "[name].[contenthash].css",
    disable: process.env.NODE_ENV === "development"
});
module.exports = {
    devtool: "source-map",
    entry: {
        dashboard: ["./app/app"],
        client: ["./client/app"]
    },
    output: {
        path: path.join(__dirname, "public/js"),
        filename: "[name]-bundle.js",
        publicPath: "/static/"
    },
    plugins: [
        new webpack.optimize.OccurrenceOrderPlugin(),
        new webpack.DefinePlugin({
            "process.env": {
                NODE_ENV: "'production'"
            }
        }),
        new webpack.optimize.UglifyJsPlugin({
            compressor: {
                warnings: false
            }
        }),
        new ExtractTextPlugin("./public/css/[name].css")
    ],
    module: {
        loaders: [
            // js
            {
                test: /\.js$/,
                loaders: ["babel-loader"],
                include: path.join(__dirname, "app")
            },
            {
                test: /\.js$/,
                loaders: ["babel-loader"],
                include: path.join(__dirname, "client")
            },
            // CSS
            {
                test: /\.scss$/,
                loaders: ExtractTextPlugin.extract({
                    fallback: "style-loader",
                    use: "css-loader"
                }),
                include: path.join(__dirname, "public/scss")
            }
        ]
    }
};
