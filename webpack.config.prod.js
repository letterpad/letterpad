var path = require("path");
var webpack = require("webpack");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const BabiliPlugin = require("babili-webpack-plugin");

const extractSass = new ExtractTextPlugin({
    filename: "../css/[name].css"
});
module.exports = {
    profile: true,
    entry: {
        dashboard: ["./admin/app"],
        client: ["./client/app"]
    },
    output: {
        path: path.join(__dirname, "public/js"),
        filename: "[name]-bundle.js"
    },
    plugins: [
        new webpack.LoaderOptionsPlugin({
            debug: true
        }),
        new webpack.optimize.OccurrenceOrderPlugin(),
        new webpack.DefinePlugin({
            "process.env": {
                NODE_ENV: "'production'"
            }
        }),
        new BabiliPlugin(),
        // new webpack.optimize.UglifyJsPlugin({
        //     compressor: {
        //         warnings: false
        //     }
        // }),
        extractSass
    ],
    module: {
        rules: [
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
