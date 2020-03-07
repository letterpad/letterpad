import { Express } from "express";
import apolloClient from "../../shared/apolloClient";
import config from "../../config";
import { dispatcher } from "./dispatcher";
import { fetchSettings } from "../../api/fetchSettings";
import fs from "fs";
import { getFile } from "./../../config/db.config";
import logger from "../../shared/logger";
import models from "../../api/models";
import { seed } from "../../api/seed/seed";

const { pathname } = new URL(config.API_URL);
const serverRendering = (app: Express) => {
  app.get("*", async (req, res, next) => {
    if (!hasDatabase()) {
      try {
        await seed(models, false);
      } catch (e) {
        console.error(e);
      }
    }
    if (req.url === pathname) return next();
    if (req.url.indexOf("/static") === 0) return next();

    const isStatic = req.get("static") ? true : false;
    try {
      const client = apolloClient(false, { ssrMode: true });
      try {
        logger.debug("SSR - Fetched settings data");
        const content = await dispatcher({
          requestUrl: req.url,
          client,
          settings: await fetchSettings(),
          isStatic,
          request: { req, res },
        });
        res.send(content);
      } catch (e) {
        logger.error(e);
      }
    } catch (e) {
      res.send(e);
    }
  });
};

export default serverRendering;

function hasDatabase() {
  if (process.env.DB_TYPE === "sqlite") {
    if (!fs.existsSync(getFile("letterpad"))) {
      return false;
    }
  }
  return true;
  // check for other databases
}
