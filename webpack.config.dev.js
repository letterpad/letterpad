var path = require("path");
var webpack = require("webpack");

module.exports = {
    devtool: "source-map",
    entry: {
        "app-admin": ["babel-polyfill", "./app/app"],
        "app-client": [
            "babel-polyfill",
            "webpack-hot-middleware/client",
            "./client/app"
        ]
    },
    output: {
        path: path.join(__dirname, "dist"),
        filename: "[name]-bundle.js",
        publicPath: "/static/"
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoEmitOnErrorsPlugin(),
        new webpack.DefinePlugin({
            "process.env": {
                NODE_ENV: '"dev"'
            }
        })
    ],
    module: {
        loaders: [
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
            // query loader
            {
                test: /\.(graphql|gql)$/,
                exclude: /node_modules/,
                loader: "graphql-tag/loader"
            },
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
            }
        ]
    }
};
