const webpack = require("webpack");
const path = require("path");
var FileNameReplacementPlugin = require("./FileNameReplacementPlugin");
const isDev = process.env.NODE_ENV === "dev" ? true : false;

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

module.exports = args => {
    const config = {
        mode: isDev ? "development" : "production",
        watch: isDev,
        entry: {
            vendor: [
                "babel-polyfill",
                "react",
                "react-dom",
                "redux",
                "react-apollo",
                "moment"
            ],
            client: [
                "babel-polyfill",
                "webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000",
                path.join(__dirname, "../client/app")
            ],
            admin: [
                "babel-polyfill",
                "webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000",
                path.join(__dirname, "../admin/app")
            ]
        },
        resolve: {
            alias: {
                admin: path.join(__dirname, "../admin"),
                client: path.join(__dirname, "../client"),
                shared: path.join(__dirname, "../shared"),
                config: path.join(__dirname, "../config")
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
            new webpack.DefinePlugin({
                "process.env": {
                    NODE_ENV: JSON.stringify(isDev ? "dev" : "production")
                }
            }),
            new FileNameReplacementPlugin(args.theme),
            new webpack.ContextReplacementPlugin(/moment[/\\]locale$/, /en/)
        ],
        module: {
            rules: [
                {
                    test: /\.js$/,
                    use: {
                        loader: "babel-loader",
                        options: babelOptions
                    },
                    include: path.join(__dirname, "../client")
                },
                // js
                {
                    test: /\.js$/,
                    use: {
                        loader: "babel-loader",
                        options: babelOptions
                    },
                    include: path.join(__dirname, "../admin")
                }
            ]
        }
    };

    if (isDev) {
        console.log("Dev build");
        config.plugins.push(
            new webpack.HotModuleReplacementPlugin(),
            new webpack.NoEmitOnErrorsPlugin()
        );
    } else {
        config.entry.client = config.entry.client.filter(entry => {
            if (entry.includes("webpack-hot-middleware")) {
                return false;
            }
            return true;
        });
    }

    return config;
};
