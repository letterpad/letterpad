const merge = require("webpack-merge");
const baseConfig = require("./webpack.base.js");
const path = require("path");
const fs = require("fs");

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
      // splitChunks: {
      //   cacheGroups: {
      //     default: false,
      //     commons: {
      //       test: "src/public/js/vendor-bundle.js",
      //       name: "src/public/js/vendor",
      //       chunks: "all",
      //     },
      //   },
      // },
    },
    module: {
      rules: [
        {
          test: /\.(png|woff|woff2|eot|ttf|svg)$/,
          loader: "url-loader?url=false",
        },
        {
          test: /\.(css|pcss)$/,
          use: [
            "style-loader",
            {
              loader: "css-loader",
              options: { importLoaders: 1, sourceMap: true },
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

const serverConfig = args => {
  if (args.theme == "") {
    args.theme = "hugo";
  }
  const BUILD_PATH = path.join(
    __dirname,
    "../src/client/themes/" + args.theme + "/public/dist",
  );

  const getExternals = () => {
    const nodeModules = {};
    fs.readdirSync("node_modules")
      .filter(function(x) {
        return [".bin"].indexOf(x) === -1;
      })
      .forEach(function(mod) {
        nodeModules[mod] = "commonjs " + mod;
      });
    return nodeModules;
  };
  const config = merge(baseConfig(args, "server"), {
    name: "server",
    cache: true,
    target: "node",
    output: {
      filename: "server.node.js",
      path: BUILD_PATH,
      library: "server",
      libraryTarget: "commonjs2",
      hotUpdateChunkFilename: "../public/hot/hot-update.js",
      hotUpdateMainFilename: "../public/hot/hot-update.json",
    },

    externals: getExternals(),
    plugins: [],
    module: {
      rules: [
        {
          test: /\.(png|woff|woff2|eot|ttf|svg)$/,
          loader: "url-loader?url=false",
        },
        {
          test: /\.(pcss|css)$/,
          use: ["css-loader/locals"],
        },
      ],
    },
  });
  // overwrite entry and do not merge from base.
  config.entry = {
    server: [path.join(__dirname, "../src/client/server/serverApp")],
  };
  return config;
};

module.exports = args => {
  return [serverConfig(args), clientConfig(args)];
};
