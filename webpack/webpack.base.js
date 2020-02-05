const webpack = require("webpack");
const path = require("path");
const fs = require("fs");
const FileNameReplacementPlugin = require("./FileNameReplacementPlugin");
const WebpackBar = require("webpackbar");

const babelRc = fs.readFileSync(path.resolve(__dirname, "../.babelrc"));

module.exports = (args, name) => {
  let source = "";
  const vendorFiles = ["react", "react-dom", "redux", "react-apollo", "moment"];
  let env = "production";
  const isProd = args.NODE_ENV === "production";
  const isDev = !isProd;

  if (isDev) {
    source = "src";
    env = "development";
  }
  const config = {
    mode: env, // for production we use this mode to ignore uglify plugin. it is slow.
    watch: isDev,
    stats: {
      cached: false,
      cachedAssets: false,
      chunks: false,
      assets: false,
      chunkModules: false,
      chunkOrigins: false,
      colors: true,
      children: false,
      modules: false,
      errors: true,
      builtAt: false,
      hash: false,
    },
    entry: {
      [source + "/public/js/vendor"]: vendorFiles,
      [source + "/client/themes/" + args.theme + "/public/dist/client"]: [
        path.join(__dirname, "../src/client/Run"),
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
      new webpack.DefinePlugin({
        "process.env": {
          NODE_ENV: JSON.stringify(env),
          API_URL: "process.env.API_URL",
          UPLOAD_URL: "process.env.UPLOAD_URL",
          ROOT_URL: "process.env.ROOT_URL",
          APP_PORT: "process.env.APP_PORT",
          BASE_NAME: "process.env.BASE_NAME",
        },
      }),
      new FileNameReplacementPlugin(args.theme),
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
      ],
    },
  };

  return config;
};
