const merge = require("webpack-merge");
const baseConfig = require("./webpack.base.js");
const webpack = require("webpack");
const path = require("path");

const clientConfig = args => {
  if (args.theme == "") {
    args.theme = "hugo";
  }
  return merge(baseConfig(args, "client"), {
    name: "client",
    devtool: "cheap-module-eval-source-map",
    target: "web",
    entry: {
      "src/public/js/hot-reload":
        "webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000",
    },
    output: {
      path: path.join(__dirname, "../"),
      filename: "[name]-bundle.js",
      publicPath: "/static/",
      pathinfo: false,
    },
    watchOptions: {
      ignored: [/node_modules([\\]+|\/)+(?!\some_npm_module_name)/],
    },
    plugins: [new webpack.HotModuleReplacementPlugin()],
    optimization: {
      minimize: false,
      runtimeChunk: {
        name: "src/public/js/vendor",
      },
      removeAvailableModules: false,
      removeEmptyChunks: false,
      splitChunks: false,
    },
    module: {
      rules: [
        {
          test: /\.(css)$/,
          use: [
            "style-loader",
            {
              loader: "css-loader",
              options: { importLoaders: 1, sourceMap: true, import: true },
            },
            "postcss-loader",
          ],
          include: [path.join(__dirname, "../src/client/themes/" + args.theme)],
        },
        {
          test: /\.(css)$/,
          use: [
            "style-loader",
            {
              loader: "css-loader",
              options: { importLoaders: 1, sourceMap: true, import: true },
            },
            "postcss-loader",
          ],
          include: [path.join(__dirname, "../src/admin")],
        },
      ],
    },
  });
};
module.exports = args => clientConfig(args);
