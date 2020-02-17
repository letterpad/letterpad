const merge = require("webpack-merge");
const baseConfig = require("./webpack.base.js");
const path = require("path");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");

const clientConfig = args => {
  if (args.theme == "") {
    args.theme = "hugo";
  }
  const extractPcss = new ExtractTextPlugin("[name].min.css");
  const extractPcssAdmin = new ExtractTextPlugin("[name].min.css");
  return merge(baseConfig(args, "client"), {
    target: "web",
    output: {
      path: path.join(__dirname, "../dist"),
      filename: "[name]-bundle.min.js",
    },
    plugins: [
      extractPcss,
      extractPcssAdmin,
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
          test: /\.(css)$/,
          use: extractPcss.extract({
            fallback: "style-loader",
            use: [
              {
                loader: "css-loader",
                options: {
                  importLoaders: 1,
                  minimize: true,
                  url: false,
                },
              },
              "postcss-loader",
            ],
          }),
          include: [path.join(__dirname, "../src/client/themes/" + args.theme)],
        },
        {
          test: /\.(css)$/,
          use: extractPcssAdmin.extract({
            fallback: "style-loader",
            use: [
              {
                loader: "css-loader",
                options: { importLoaders: 1, minimize: true },
              },
            ],
          }),
        },
      ],
    },
  });
};

module.exports = args => [clientConfig(args)];
