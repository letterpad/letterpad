import { Express } from "express";
import { QUERY_SETTINGS } from "../../shared/queries/Queries";
import { SettingsQuery } from "../../__generated__/gqlTypes";
import { TypeSettings } from "../types";
import apolloClient from "../../shared/apolloClient";
import { dispatcher } from "./dispatcher";
import fs from "fs";
import { getFile } from "./../../config/db.config";
import logger from "../../shared/logger";
import models from "../../api/models";
import { seed } from "../../api/seed/seed";

const serverRendering = (app: Express) => {
  app.get("*", async (req, res, next) => {
    if (!hasDatabase()) {
      try {
        await seed(models, false);
      } catch (e) {
        console.error(e);
      }
    }
    if (req.url === "/graphql") return next();
    if (req.url.indexOf("/static") === 0) return next();

    const isStatic = req.get("static") ? true : false;
    try {
      const client = apolloClient(false, { ssrMode: true });
      try {
        // get the settings data. It contains information about the theme that we want to render.
        const settings = await client.query<SettingsQuery>({
          query: QUERY_SETTINGS,
        });
        const formattedSettings: TypeSettings | {} = {};
        settings.data.settings.forEach(item => {
          formattedSettings[item.option] = item;
        });
        logger.debug("SSR - Fetched settings data");
        const content = await dispatcher({
          requestUrl: req.url,
          client,
          settings: formattedSettings as TypeSettings,
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
