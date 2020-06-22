import * as fs from "fs";

import { Request, Response } from "express";

import { IThemeConfig } from "../../../types/types";
import { QUERY_SETTINGS } from "./../../../shared/queries/Queries";
import { SettingsQuery } from "../../../__generated__/gqlTypes";
import apolloClient from "../../../shared/apolloClient";
import { clientOpts } from "..";
import config from "../../../config";
import { getDirPath } from "../../../dir";
import { getDirectories } from "../../../shared/dir";
import path from "path";
import { syncThemeSettings } from "../util";

const themesDir = getDirPath("client/themes");
export const getThemes = async (req: Request, res: Response) => {
  try {
    const currentTheme = await getCurrentTheme(req);
    const availableThemes: Array<IThemeConfig> = [];
    const newSettings: Array<object> = [];
    // Get all the folders inside the "themes" folder. Check if each
    // of those folder has a "config.json" file. If found, we will assume that
    // as a valid theme.
    getDirectories(themesDir).map(themePath => {
      const configJson = path.join(themePath, "config.json");
      const settingsJson = path.join(themePath, "settings.json");

      if (fs.existsSync(configJson)) {
        // delete cache to get updated file
        delete require.cache[require.resolve(configJson)];
        // get all the contents from the "config" file.
        const contents = require(configJson);
        const themeConfig: IThemeConfig = Object.assign({}, contents);
        const theme_name = themePath.split("/").pop() as string;
        // check if it has a thumbnail without http
        if (themeConfig.thumbnail.indexOf("http") === -1) {
          themeConfig.thumbnail =
            config.BASE_NAME + "/" + theme_name + themeConfig.thumbnail;
        }
        // check the theme has settings
        const hasSettings = fs.existsSync(settingsJson);

        themeConfig.active = theme_name === currentTheme;
        themeConfig.settings = hasSettings;
        themeConfig.folder_name = theme_name;
        availableThemes.push(themeConfig);
        // get default settings of all themes from files
        if (hasSettings) {
          // we need to delete the cache, to get updated settings file
          delete require.cache[require.resolve(settingsJson)];
          const defaultSettings = require(require.resolve(settingsJson));
          newSettings.push({
            name: theme_name,
            settings: defaultSettings,
          });
        }
      }
    });
    // If the theme developer has changed the settings of the theme,
    // it has to sync with the database.
    try {
      await syncThemeSettings(newSettings, req.headers.authorization);
    } catch (e) {
      console.log(e);
    }
    res.send(availableThemes);
  } catch (e) {
    return res.send(e);
  }
};

async function getCurrentTheme(req: Request) {
  let currentTheme = "hugo";
  const response = await apolloClient(
    true,
    clientOpts,
    req.headers.token as string,
  ).query<SettingsQuery>({ query: QUERY_SETTINGS });

  if (!response.data.settings) {
    return null;
  }
  currentTheme = response.data.settings.theme;

  return currentTheme;
}
