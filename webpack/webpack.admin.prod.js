const merge = require("webpack-merge");
const baseConfig = require("./webpack.base.js");
const path = require("path");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const MinifyPlugin = require("babel-minify-webpack-plugin");
const vendorFiles = [
  "@babel/polyfill",
  "react",
  "react-dom",
  "redux",
  "react-apollo",
  "moment",
];
const clientConfig = args => {
  const extractPcssAdmin = new ExtractTextPlugin("[name].min.css");
  if (typeof args === "undefined") {
    args = { theme: "" };
  }
  const config = merge(baseConfig(args, "admin"), {
    target: "web",
    output: {
      path: path.join(__dirname, "../"),
      filename: "[name]-bundle.min.js",
    },
    plugins: [extractPcssAdmin, new MinifyPlugin()],
    module: {
      rules: [
        {
          test: /\.(css|pcss)$/,
          use: extractPcssAdmin.extract({
            fallback: "style-loader",
            use: [
              {
                loader: "css-loader",
                options: { importLoaders: 1, minimize: true },
              },
              "postcss-loader",
            ],
          }),
          include: [
            path.resolve(__dirname, "../admin"),
            path.resolve(__dirname, "../node_modules"),
            path.resolve(__dirname, "../public"),
          ],
        },
      ],
    },
  });
  config.entry = {
    "admin/public/dist/admin": [path.join(__dirname, "../admin/app")],
    ["public/js/vendor"]: vendorFiles,
  };
  return config;
};

module.exports = args => [clientConfig(args)];
