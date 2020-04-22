const env = require("node-env-file");
env(__dirname + "/../../.env");

import apiServer from "./server";
import bodyParser from "body-parser";
import express from "express";

const apiApp = express();

const bodyParserMiddleWare = bodyParser.urlencoded({
  extended: true,
});
apiApp.use(bodyParserMiddleWare);
apiApp.use(bodyParser.json());

apiServer(apiApp);
apiApp.listen(1111, function() {
  console.log("Letterpad API listening at http://localhost:1111");
});
