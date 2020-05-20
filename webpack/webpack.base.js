const webpack = require("webpack");
const path = require("path");
const fs = require("fs");
const WebpackBar = require("webpackbar");
const babelRc = fs.readFileSync(path.resolve(__dirname, "../.babelrc"));
const FormatStats = require("./build");

module.exports = (args, name) => {
  let source = "";
  let env = "production";
  const isProd = args.NODE_ENV === "production";
  const isDev = !isProd;
  if (isDev) {
    source = "src";
    env = "development";
  }
  if (args.NODE_ENV === "test") {
    env = "test";
  }
  const config = {
    mode: env,
    devtool: "#source-map",
    stats: "errors-only",
    entry: {
      [source + "/client/themes/" + args.theme + "/public/dist/client"]: [
        path.join(__dirname, "../src/client/ClientApp"),
      ],
      [source + "/admin/public/dist/admin"]: [
        path.join(__dirname, "../src/admin/app"),
      ],
    },
    resolve: {
      alias: {
        admin: path.resolve(__dirname, "../src/admin"),
        client: path.resolve(__dirname, "../src/client"),
        shared: path.resolve(__dirname, "../src/shared"),
        config: path.resolve(__dirname, "../src/config"),
        "styled-components$": path.resolve(
          __dirname,
          "../",
          "./node_modules/styled-components",
        ),
        react: path.resolve(__dirname, "../", "./node_modules/react"),
      },
      extensions: [".tsx", ".ts", ".js"],
    },
    plugins: [
      new WebpackBar({ name: name }),
      new FormatStats({ env }),
      new webpack.DefinePlugin({
        "process.env": {
          NODE_ENV: JSON.stringify(env),
          API_URL: "process.env.API_URL",
          UPLOAD_URL: "process.env.UPLOAD_URL",
          ROOT_URL: "process.env.ROOT_URL",
          APP_PORT: "process.env.APP_PORT",
          BASE_NAME: "process.env.BASE_NAME",
          THEME: JSON.stringify(args.theme),
        },
      }),
      new webpack.ContextReplacementPlugin(/moment[/\\]locale$/, /en/),
    ],

    module: {
      rules: [
        {
          test: /\.ts(x?)$/,
          exclude: /node_modules/,
          use: [
            {
              loader: "babel-loader",
              options: {
                cacheDirectory: true,
                ...JSON.parse(babelRc),
              },
            },
            {
              loader: "ts-loader",
              options: {
                transpileOnly: true,
                experimentalWatchApi: true,
              },
            },
          ],
        },
        {
          test: /\.(graphql|gql)$/,
          exclude: /node_modules/,
          loader: "graphql-tag/loader",
        },
        {
          test: /\.html$/,
          use: {
            loader: "html-loader",
          },
        },
        {
          test: /\.md$/,
          use: [
            {
              loader: "html-loader",
            },
            {
              loader: "markdown-loader",
              options: {
                /* your options here */
              },
            },
          ],
        },
        {
          test: /\.(png|jpe?g|gif|woff(2)?|ttf|eot|svg)$/i,
          use: [
            {
              loader: "url-loader",
              options: {
                name: "[name].[ext]",
                limit: 9000,
              },
            },
          ],
        },
      ],
    },
  };

  return config;
};
