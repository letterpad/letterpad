var path = require("path");
var webpack = require("webpack");
var fs = require("fs");

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
module.exports.babelOptions = babelOptions;

module.exports.loaders = [
    {
        test: /\.(png|woff|woff2|eot|ttf|svg)$/,
        loader: "url-loader?url=false"
    },
    // CSS
    {
        test: /\.css$/,
        use: ["style-loader", "css-loader"]
    },
    {
        test: /\.scss$/,
        use: [
            {
                loader: "css-loader",
                options: { importLoaders: 1 }
            },
            "postcss-loader"
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
        include: path.join(__dirname, "../admin")
    },
    {
        test: /\.js$/,
        use: {
            loader: "babel-loader",
            options: babelOptions
        },
        include: path.join(__dirname, "../client")
    }
];

module.exports.commonConfig = {
    devtool: "source-map",
    mode: "development",
    watch: true,
    resolve: {
        alias: {
            admin: path.join(__dirname, "../admin"),
            client: path.join(__dirname, "../client"),
            shared: path.join(__dirname, "../shared")
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
        new webpack.NoEmitOnErrorsPlugin()
    ]
};

var nodeModules = {};
fs
    .readdirSync("node_modules")
    .filter(function(x) {
        return [".bin"].indexOf(x) === -1;
    })
    .forEach(function(mod) {
        nodeModules[mod] = "commonjs " + mod;
    });
module.exports.nodeModules = nodeModules;
