import path from "path";
import fs from "fs";
import { Request, Response } from "express";
import { GET_OPTIONS } from "./../../../shared/queries/Queries";
import { getOptions } from "../../../shared/queries/types/getOptions";
import apolloClient from "../../../shared/apolloClient";
import { clientOpts } from "..";
import { IThemeConfig } from "../../../types/types";
import { getDirectories } from "../../../shared/dir";
import config from "../../../config";
import { syncThemeSettings } from "../util";

const themesDir = path.join(__dirname, "../../../client/themes/");
let selectedTheme = "hugo";

export const getThemes = async (req: Request, res: Response) => {
  try {
    const response = await apolloClient(
      true,
      clientOpts,
      req.headers.token as string,
    ).query<getOptions>({ query: GET_OPTIONS });

    if (!response.data.settings) {
      return null;
    }
    let option = response.data.settings.find(
      item => item && item.option === "theme",
    );
    if (option && option.value) {
      selectedTheme = option.value;
    }
    const availableThemes: Array<IThemeConfig> = [];
    const newSettings: Array<object> = [];
    // Get all the folders inside the "themes" folder. Check if each
    // of those folder has a "config.json" file. If found, we will assume that
    // as a valid theme.
    getDirectories(themesDir).map(themePath => {
      if (fs.existsSync(themePath + "/config.json")) {
        // delete cache to get updated file
        delete require.cache[require.resolve(themePath + "/config.json")];
        // get all the contents from the "config" file.
        const contents = require(themePath + "/config.json");
        const themeConfig: IThemeConfig = Object.assign({}, contents);
        const folder_name = themePath.split("/").pop();
        // check if it has a thumbnail without http
        if (themeConfig.thumbnail.indexOf("http") === -1) {
          themeConfig.thumbnail =
            config.baseName + "/" + folder_name + themeConfig.thumbnail;
        }
        // check the theme has settings
        const hasSettings = fs.existsSync(themePath + "/settings.json");

        themeConfig.active = themeConfig.short_name === selectedTheme;
        themeConfig.settings = hasSettings;
        availableThemes.push(themeConfig);
        // get default settings of all themes from files
        if (hasSettings) {
          // we need to delete the cache, to get updated settings file
          delete require.cache[require.resolve(themePath + "/settings.json")];
          const defaultSettings = require(themePath + "/settings.json");
          const values = {};
          defaultSettings.forEach(field => {
            values[field.name] = field.defaultValue;
          });
          newSettings.push({
            name: themeConfig.short_name,
            value: JSON.stringify(values),
            settings: JSON.stringify(defaultSettings),
          });
        }
      }
    });
    // If the theme developer has changed the settings of the theme,
    // it has to sync with the database.
    await syncThemeSettings(
      apolloClient,
      newSettings,
      req.headers.authorization,
    );
    res.send(availableThemes);
  } catch (e) {
    return res.send(e);
  }
};
