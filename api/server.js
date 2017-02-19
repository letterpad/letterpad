import express from "express";
import session from "express-session";
import bodyParser from "body-parser";
import config from "../config/config";
import * as actions from "./actions/index";
import { mapUrl } from "./utils/url.js";
import http from "http";
import cors from "cors";
const app = express();
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);
app.use(cors());
app.options('*', cors());
app.use(bodyParser.json());
const server = new http.Server(app);

app.use((req, res) => {
  const splittedUrlPath = req.url.split("?")[0].split("/").slice(1);
  const { action, params } = mapUrl(actions, splittedUrlPath);

  if (action) {
    action(req, params).then(
      result => {
        if (result instanceof Function) {
          result(res);
        } else {
          res.json(result);
        }
      },
      reason => {
        if (reason && reason.redirect) {
          res.redirect(reason.redirect);
        } else {
          console.error("API ERROR:", reason);
          res.status(reason.status || 500).json(reason);
        }
      }
    );
  } else {
    res.status(404).end("NOT FOUND");
  }
});

if (config.apiPort) {
  const runnable = server.listen(config.apiPort, err => {
    if (err) {
      console.error(err);
    }
    console.info("----\n==> 🌎  API is running on port %s", config.apiPort);
    console.info("==> 💻  Send requests to %s", config.apiUrl);
  });
} else {
  console.error("==>     ERROR: No PORT environment variable has been specified");
}