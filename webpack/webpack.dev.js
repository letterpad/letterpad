const merge = require("webpack-merge");
const baseConfig = require("./webpack.base.js");
const webpack = require("webpack");
const path = require("path");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

const clientConfig = args => {
  if (args.theme == "") {
    args.theme = "hugo";
  }
  return merge(baseConfig(args, "client"), {
    name: "client",
    devtool: "cheap-module-eval-source-map",
    target: "web",
    output: {
      path: path.join(__dirname, "../"),
      filename: "[name]-bundle.js",
      publicPath: "/static/",
      pathinfo: false,
    },
    watchOptions: {
      ignored: [/node_modules([\\]+|\/)+(?!\some_npm_module_name)/],
    },
    optimization: {
      minimize: false,
      runtimeChunk: {
        name: "src/public/js/vendor",
      },
      removeAvailableModules: false,
      removeEmptyChunks: false,
      splitChunks: false,
    },
    plugins: [
      new webpack.HotModuleReplacementPlugin(),
      new CleanWebpackPlugin(),
    ],
    module: {
      rules: [
        {
          test: /\.(png|woff|woff2|eot|ttf|svg)$/,
          loader: "url-loader?url=false",
        },
        {
          test: /\.(css)$/,
          use: [
            "style-loader",
            {
              loader: "css-loader",
              options: { importLoaders: 1, sourceMap: true, import: true },
            },
            {
              loader: "postcss-loader",
              options: {
                sourceMap: "inline",
              },
            },
          ],
        },
      ],
    },
  });
};
module.exports = args => clientConfig(args);
// module.exports = args => {
//   return [clientConfig(args)];
// };
//serverConfig(args),
