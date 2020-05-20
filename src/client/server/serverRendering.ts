import { ThemeSettings, ThemesQuery } from "./../../__generated__/gqlTypes";

import { Express } from "express";
import { QUERY_THEMES } from "./../../shared/queries/Queries";
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
    res.setHeader("content-type", "text/html");
    if (cache.has(req.url)) {
      return res.send(cache.get(req.url));
    }
    if (!(await hasDatabase())) {
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

      let themeName = config.THEME || settings.theme;
      try {
        logger.debug("SSR - Fetched settings data", req.url);
        const content = await contentProvider({
          requestUrl: req.url,
          client,
          settings,
          themeSettings: await getThemeSettings(themeName),
          isStatic,
          request: { req, res },
        });
        if (req.path.indexOf("rss.xml") >= 0) {
          res.setHeader("content-type", "application/xml");
        }
        if (typeof content === "string") {
          cache.set(req.url, content);
          res.end(content);
        } else {
          content.pipe(res);
        }
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

async function hasDatabase() {
  if (process.env.DB_TYPE === "sqlite") {
    if (!fs.existsSync(getFile("letterpad"))) {
      return false;
    }
  } else {
    try {
      await fetchSettings();
    } catch {
      return false;
    }
  }
  return true;
}

/**
 * Get app initial data
 */
async function getThemeSettings(
  themeName: string,
): Promise<ThemeSettings[] | []> {
  const client = apolloClient(false);
  let themeSettings: ThemeSettings[] | [] = [];
  try {
    const themeResult = await client.query<ThemesQuery>({
      query: QUERY_THEMES,
      variables: {
        name: themeName,
      },
    });
    if (themeResult.data && themeResult.data.themes.length > 0) {
      themeSettings = themeResult.data.themes[0].settings as ThemeSettings[];
    }
    return themeSettings;
  } catch (e) {}
  return themeSettings;
}
