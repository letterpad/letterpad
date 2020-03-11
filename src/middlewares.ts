import { Express } from "express";
import bodyParser from "body-parser";
import config from "./config";

const bodyParserMiddleWare = bodyParser.urlencoded({
  extended: true,
});

// Express middlewares

export default function(app: Express) {
  app.use(bodyParserMiddleWare);
  app.use(bodyParser.json());

  // Hot reloading
  if (process.env.NODE_ENV !== "production") {
    const wpConfigFile = "../webpack/webpack.dev.js";
    const webpackConfig = require(wpConfigFile)({
      theme: config.THEME,
    });

    const compiler = require("webpack")(webpackConfig);
    const webpackDevMiddleware = require("webpack-dev-middleware");
    const webpackHotMiddleware = require("webpack-hot-middleware");
    app
      .use(
        webpackDevMiddleware(compiler, {
          noInfo: true,
          hot: true,
          publicPath: webpackConfig.output.publicPath,
          stats: "normal",
          historyApiFallback: true,
        }),
      )
      .use(
        webpackHotMiddleware(compiler, {
          log: console.log,
          path: "/__webpack_hmr",
          heartbeat: 200,
        }),
      );
  }
}
