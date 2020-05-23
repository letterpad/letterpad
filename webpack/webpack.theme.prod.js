const merge = require("webpack-merge");
const baseConfig = require("./webpack.base.js");
const path = require("path");
const fs = require("fs");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const MinifyPlugin = require("babel-minify-webpack-plugin");

const clientConfig = args => {
  if (typeof args.theme === "undefined") {
    throw new Error("Please provide a theme to build");
  }
  const extractPcss = new ExtractTextPlugin("[name].min.css");
  //const extractPcssAdmin = new ExtractTextPlugin("[name].min.css");
  const config = merge(baseConfig(args, "client + admin"), {
    target: "web",
    output: {
      path: path.join(__dirname, "../dist"),
      filename: "[name]-bundle.min.js",
    },
    plugins: [extractPcss, new MinifyPlugin()],
    module: {
      rules: [
        {
          test: /\.(css|pcss)$/,
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
      ],
    },
  });
  config.entry = {
    ["client/themes/" + args.theme + "/public/dist/client"]: [
      path.join(__dirname, "../src/client/app"),
    ],
  };
  return config;
};

module.exports = args => [clientConfig(args)];
