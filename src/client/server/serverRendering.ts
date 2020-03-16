import { Express } from "express";
import apolloClient from "../../shared/apolloClient";
import cache from "./cache";
import config from "../../config";
import { contentProvider } from "./contentProvider";
import { fetchSettings } from "../../api/fetchSettings";
import fs from "fs";
import { getFile } from "./../../config/db.config";
import logger from "../../shared/logger";
import models from "../../api/models";
import { seed } from "../../api/seed/seed";

const { pathname } = new URL(config.API_URL);
const serverRendering = (app: Express) => {
  app.get("*", async (req, res, next) => {
    if (cache.has(req.url)) {
      return res.send(cache.get(req.url));
    }
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
      const settings = await fetchSettings();

      try {
        logger.debug("SSR - Fetched settings data");
        const content = await contentProvider({
          requestUrl: req.url,
          client,
          settings,
          isStatic,
          request: { req, res },
        });
        cache.set(req.url, content);
        res.end(content);
      } catch (e) {
        logger.error(e);
      }
    } catch (e) {
      logger.error(e);
      res.end(JSON.stringify(e));
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
