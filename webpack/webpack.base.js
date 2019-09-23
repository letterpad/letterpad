const webpack = require("webpack");
const path = require("path");
const fs = require("fs");
var FileNameReplacementPlugin = require("./FileNameReplacementPlugin");
const WebpackBar = require("webpackbar");

const isDev = process.env.NODE_ENV === "dev" ? true : false;
const babelRc = fs.readFileSync(path.resolve(__dirname, "../.babelrc"));

const vendorFiles = ["react", "react-dom", "redux", "react-apollo", "moment"];
let source = "";
if (isDev) {
  source = "src";
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
      hash: false,
    },
    entry: {
      [source + "/public/js/vendor"]: vendorFiles,
      [source + "/client/themes/" + args.theme + "/public/dist/client"]: [
        path.join(__dirname, "../src/client/app"),
      ],
      [source + "/admin/public/dist/admin"]: [
        path.join(__dirname, "../src/admin/app"),
      ],
    },
    resolve: {
      alias: {
        admin: path.join(__dirname, "/../src/admin"),
        client: path.join(__dirname, "/../src/client"),
        shared: path.join(__dirname, "/../src/shared"),
        config: path.join(__dirname, "/../src/config"),
      },
      extensions: [".js"],
    },
    plugins: [
      new WebpackBar({ name: name }),
      new webpack.DefinePlugin({
        "process.env": {
          NODE_ENV: JSON.stringify(isDev ? "dev" : "production"),
        },
      }),
      new webpack.DefinePlugin({
        "process.env": {
          apiUrl: "process.env.apiUrl",
          uploadUrl: "process.env.uploadUrl",
          rootUrl: "process.env.rootUrl",
          appPort: "process.env.appPort",
          apiPort: "process.env.apiPort",
          baseName: "process.env.baseName",
        },
      }),
      new FileNameReplacementPlugin(args.theme),
      new webpack.ContextReplacementPlugin(/moment[/\\]locale$/, /en/),
    ],

    module: {
      rules: [
        {
          test: /\.js$/,
          use: [
            {
              loader: "babel-loader",
              options: {
                ...JSON.parse(babelRc),
              },
            },
            // { loader: "eslint-loader" },
          ],
          include: path.join(__dirname, "../src/client"),
        },
        // js
        {
          test: /\.js$/,
          use: [
            {
              loader: "babel-loader",
              options: {
                ...JSON.parse(babelRc),
              },
            },
            { loader: "eslint-loader" },
          ],
          include: path.join(__dirname, "../src/admin"),
        },
        {
          test: /\.html$/,
          use: {
            loader: "html-loader",
          },
        },
      ],
    },
  };

  if (isDev) {
    config.plugins.push(new webpack.HotModuleReplacementPlugin());
  }

  return config;
};
