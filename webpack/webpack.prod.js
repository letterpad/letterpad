const merge = require("webpack-merge");
const baseConfig = require("./webpack.base.js");
const path = require("path");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");

const clientConfig = args => {
  if (args.theme == "") {
    args.theme = "hugo";
  }
  const extractThemeCss = new ExtractTextPlugin("[name].min.css");
  const extractAdminCSS = new ExtractTextPlugin("[name].min.css");
  return merge(baseConfig(args, "client"), {
    target: "web",
    devtool: undefined,
    output: {
      path: path.join(__dirname, "../dist"),
      filename: "[name]-bundle.min.js",
    },
    plugins: [
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
          from: __dirname + "/../src/client/themes/**/public/**",
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
          use: extractThemeCss.extract({
            fallback: "style-loader",
            use: [
              {
                loader: "css-loader",
                options: {
                  importLoaders: 1,
                  url: false,
                },
              },
              "postcss-loader",
            ],
          }),
          include: [path.join(__dirname, "../src/client/themes/")],
        },
        {
          test: /\.css$/,
          use: extractAdminCSS.extract({
            fallback: "style-loader",
            use: [
              {
                loader: "css-loader",
                options: { importLoaders: 1 },
              },
            ],
          }),
          include: [path.join(__dirname, "../src/admin")],
        },
      ],
    },
  });
};

module.exports = args => [clientConfig(args)];
