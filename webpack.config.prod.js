var path = require("path");
var webpack = require("webpack");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const MinifyPlugin = require("babel-minify-webpack-plugin");

const extractSass = new ExtractTextPlugin({
    filename: "../css/[name].css"
});

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
                useBuiltIns: true
            }
        ]
    ],

    plugins: ["transform-object-rest-spread"]
};

module.exports = {
    profile: true,
    mode: "production",
    entry: {
        vendor: [
            "./public/js/polyfill.js",
            "react",
            "react-dom",
            "redux",
            "react-apollo"
        ],
        admin: ["./public/js/polyfill.js", "./admin/app"],
        client: ["./public/js/polyfill.js", "./client/app"]
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
        runtimeChunk: false
    },
    plugins: [
        new webpack.optimize.OccurrenceOrderPlugin(),
        new webpack.DefinePlugin({
            "process.env": {
                NODE_ENV: "'production'"
            }
        }),
        new MinifyPlugin(),
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
