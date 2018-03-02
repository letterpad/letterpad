var path = require("path");
var webpack = require("webpack");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const BabiliPlugin = require("babili-webpack-plugin");

const extractSass = new ExtractTextPlugin({
    filename: "../css/[name].css"
});
module.exports = {
    profile: true,
    mode: "production",
    entry: {
        vendor: [
            "babel-polyfill",
            "react",
            "react-dom",
            "redux",
            "react-apollo"
        ],
        admin: ["babel-polyfill", "./admin/app"],
        client: ["babel-polyfill", "./client/app"]
    },
    output: {
        path: path.join(__dirname, "public/js"),
        filename: "[name]-bundle.js"
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
        new webpack.optimize.OccurrenceOrderPlugin(),
        new webpack.DefinePlugin({
            "process.env": {
                NODE_ENV: "'production'"
            }
        }),
        new BabiliPlugin(),
        extractSass
    ],
    module: {
        rules: [
            {
                test: /\.css$/,
                loaders: ["style-loader", "css-loader"]
            },
            {
                test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
                loader: "url-loader?limit=10000&mimetype=image/svg+xml"
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
            },
            // CSS
            {
                test: /\.scss$/,
                use: extractSass.extract({
                    fallback: "style-loader",
                    use: ["css-loader", "sass-loader"],
                    publicPath: path.join(__dirname, "public/css")
                }),
                include: path.join(__dirname, "public/scss")
            }
        ]
    }
};
