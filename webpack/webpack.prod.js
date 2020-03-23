const merge = require("webpack-merge");
const webpack = require("webpack");
const baseConfig = require("./webpack.base.js");
const path = require("path");
const ExtractTextPlugin = require("mini-css-extract-plugin");
const CopyPlugin = require("copy-webpack-plugin");

const clientConfig = args => {
  if (args.theme == "") {
    args.theme = "hugo";
  }
  const extractThemeCss = new ExtractTextPlugin({
    filename: "[name].min.css",
  });
  const extractAdminCSS = new ExtractTextPlugin({
    filename: "[name].min.css",
  });
  return merge(baseConfig(args, "client"), {
    target: "web",
    devtool: undefined,
    output: {
      path: path.join(__dirname, "../dist"),
      filename: "[name]-bundle.min.js",
    },
    plugins: [
      new webpack.NormalModuleReplacementPlugin(
        /themes\/.*?\/app.tsx/,
        result => {
          if (result.resource) {
            result.resource = result.resource.replace(
              /themes\/.*?\/app.tsx/,
              "/themes/" + args.theme + "/app.tsx",
            );
          }
        },
      ),
      extractThemeCss,
      extractAdminCSS,
      new CopyPlugin([
        {
          from: __dirname + "/../src/admin/public",
          to: __dirname + "/../dist/admin/public",
          force: true,
        },
        {
          from: __dirname + "/../src/api/schema",
          to: __dirname + "/../dist/api/schema",
          force: true,
        },
        {
          from: __dirname + "/../src/admin/server/response/content.tpl",
          to: __dirname + "/../dist/admin/server/response/content.tpl",
        },
        {
          from: __dirname + "/../src/client/template.tpl",
          to: __dirname + "/../dist/client/template.tpl",
        },
        {
          from: __dirname + "/../src/api/seed/uploads",
          to: __dirname + "/../dist/api/seed/uploads",
        },
        {
          from: __dirname + "/../src/public/robots.txt",
          to: __dirname + "/../dist/public/robots.txt",
        },
        {
          from: __dirname + "/../src/api/seed/uploads",
          to: __dirname + "/../dist/public/uploads/",
        },
        {
          from:
            __dirname + "/../src/client/themes/" + args.theme + "/public/**",
          to: __dirname + "/..",
          transformPath(targetPath) {
            return targetPath.replace("src", "dist");
          },
        },
        {
          from: __dirname + "/../src/client/themes/" + args.theme + "/*.json",
          to: __dirname + "/..",
          transformPath(targetPath) {
            return targetPath.replace("src", "dist");
          },
        },
      ]),
    ],
    module: {
      rules: [
        {
          test: /\.css$/,
          use: [
            {
              loader: ExtractTextPlugin.loader,
            },
            {
              loader: "css-loader",
              options: {
                importLoaders: 1,
                url: true,
              },
            },
            "postcss-loader",
          ],
          include: [
            path.join(__dirname, "../src/client/themes/", args.theme, "/"),
          ],
        },
        {
          test: /\.css$/,
          use: [
            {
              loader: ExtractTextPlugin.loader,
            },
            {
              loader: "css-loader",
              options: {
                importLoaders: 1,
                url: true,
              },
            },
            "postcss-loader",
          ],
          include: [path.join(__dirname, "../src/admin")],
        },
      ],
    },
  });
};

module.exports = args => [clientConfig(args)];
