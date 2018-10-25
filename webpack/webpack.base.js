const webpack = require("webpack");
const path = require("path");
const fs = require("fs");
var FileNameReplacementPlugin = require("./FileNameReplacementPlugin");
const WriteFilePlugin = require("write-file-webpack-plugin");
const WebpackBar = require("webpackbar");

const isDev = process.env.NODE_ENV === "dev" ? true : false;
const babelRc = fs.readFileSync(path.resolve(__dirname, "../.babelrc"));

const vendorFiles = [
    "@babel/polyfill",
    "react",
    "react-dom",
    "redux",
    "react-apollo",
    "moment"
];
if (isDev) {
    vendorFiles.push("webpack-hot-middleware/client?reload=true");
}
module.exports = (args, name) => {
    const config = {
        mode: "development", // for production we use this mode to ignore uglify plugin. it is slow.
        watch: isDev,
        stats: {
            cached: false,
            cachedAssets: false,
            chunks: false,
            assets: true,
            chunkModules: false,
            chunkOrigins: false,
            modules: false,
            errors: true,
            builtAt: true,
            hash: false
        },
        entry: {
            ["public/js/vendor"]: vendorFiles,
            ["client/themes/" + args.theme + "/public/dist/client"]: [
                path.join(__dirname, "../client/app")
            ],
            "admin/public/dist/admin": [path.join(__dirname, "../admin/app")]
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
        plugins: [
            new WebpackBar({ name: name }),
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
                    use: [
                        {
                            loader: "babel-loader",
                            options: {
                                ...JSON.parse(babelRc)
                            }
                        },
                        { loader: "eslint-loader" }
                    ],
                    include: path.join(__dirname, "../client")
                },
                // js
                {
                    test: /\.js$/,
                    use: [
                        {
                            loader: "babel-loader",
                            options: {
                                ...JSON.parse(babelRc)
                            }
                        },
                        { loader: "eslint-loader" }
                    ],
                    include: path.join(__dirname, "../admin")
                },
                {
                    test: /\.html$/,
                    use: {
                        loader: "html-loader"
                    }
                }
            ]
        }
    };

    if (isDev) {
        config.plugins.push(new webpack.HotModuleReplacementPlugin());
    }

    return config;
};
