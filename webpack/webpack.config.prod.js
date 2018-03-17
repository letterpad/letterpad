var path = require("path");
var webpack = require("webpack");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const MinifyPlugin = require("babel-minify-webpack-plugin");
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer")
    .BundleAnalyzerPlugin;

const extractSass = new ExtractTextPlugin({
    filename: "../css/[name].css"
});

module.exports = {
    profile: true,
    mode: "production",
    entry: {
        vendor: [
            "./public/js/polyfill.js",
            "react",
            "react-dom",
            "redux",
            "react-apollo",
            "moment"
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
        new BundleAnalyzerPlugin(),
        new webpack.optimize.OccurrenceOrderPlugin(),
        new webpack.DefinePlugin({
            "process.env": {
                NODE_ENV: "'production'"
            }
        }),
        new webpack.ContextReplacementPlugin(/moment[/\\]locale$/, /en/),
        new MinifyPlugin(),
        extractSass
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
