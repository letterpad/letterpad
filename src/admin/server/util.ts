import { ThemeSettingsUIInputTypes } from "./../../../types/globalTypes";
import {
  insertThemes,
  insertThemesVariables,
} from "./../../shared/queries/types/insertThemes";
import {
  themes,
  themesVariables,
  themes_themes,
} from "./../../shared/queries/types/themes";
import config from "../../config";
import { THEME_SETTINGS } from "../../shared/queries/Queries";
import {
  INSERT_THEME_SETTINGS,
  UPDATE_THEME_SETTINGS,
} from "../../shared/queries/Mutations";
import utils from "../../shared/util";
import apolloClient from "../../shared/apolloClient";

interface IUploadFileProps {
  files: FileList;
  type?: string;
}

export const uploadFile = ({ files, type }: IUploadFileProps) => {
  const data: FormData = new FormData();
  if (type) {
    data.append("type", type);
  }
  for (let i = 0; i < files.length; i++) {
    data.append("file", files[i]);
  }

  return fetch(config.uploadUrl, {
    method: "post",
    body: data,
    headers: {
      authorization: localStorage.token,
    },
  })
    .then(data => {
      return data.json();
    })
    .then(async image => {
      return image;
    });
};

/**
 * When new version of theme settings are available,
 * it needs to be synced with the values saved in the database.
 *
 */
export const syncThemeSettings = async (
  themeConfigsFromFS: any,
  authorization: string | undefined,
) => {
  // Get the existing theme settings
  const { data } = await apolloClient(true, {}, authorization).query<
    themes,
    themesVariables
  >({
    query: THEME_SETTINGS,
  });
  const themeConfigsFromDB = data.themes;

  // Check if the theme settings exist in the db.
  // Remove the unused ones.
  // We will compare with the field "name"

  const keyField = "name";
  const compareFields = ["name"];
  const result = utils.syncArrays(
    themeConfigsFromDB,
    themeConfigsFromFS,
    keyField,
    compareFields,
  );
  // new themes to be inserted in db
  const promises = result.added.map(({ name, settings }) => {
    return insertThemeSettings(name, settings, authorization);
  });
  // existing theme settings to be updated
  const updatePromises = [] as any;

  themeConfigsFromFS.forEach((_config: themes_themes) => {
    const themeName = _config.name;
    const themeSettings = _config.settings;
    const dbThemeSetting = getDBThemeSetting(themeConfigsFromDB, themeName);
    if (dbThemeSetting) {
      const updatedThemeSettings = themeSettings.map(setting => {
        const settingFound = dbThemeSetting.settings.find(
          oldSetting =>
            oldSetting && setting && oldSetting.name === setting.name,
        );
        if (settingFound && settingFound.changedValue) {
          if (
            setting.type !== ThemeSettingsUIInputTypes.text &&
            setting.options &&
            !setting.options.includes(settingFound.changedValue)
          ) {
            setting.changedValue = setting.defaultValue;
          } else {
            setting.changedValue = settingFound.changedValue;
          }
        }
        return setting;
      });
      const promise = updateThemeSetting(
        themeName,
        updatedThemeSettings,
        authorization,
      );
      updatePromises.push(promise);
    }
  });
  return Promise.all([promises, updatePromises]);
};

function getDBThemeSetting(dbThemeConfigs, themeName: string): themes_themes {
  return dbThemeConfigs.find(config => config.name === themeName);
}

function updateThemeSetting(themeName, themeSettings, authorization) {
  return apolloClient(true, {}, authorization).mutate({
    mutation: UPDATE_THEME_SETTINGS,
    variables: {
      name: themeName,
      settings: themeSettings,
    },
    context: {
      headers: {
        authorization,
      },
    },
  });
}

function insertThemeSettings(themeName, themeSettings, authorization) {
  return apolloClient(true, {}, authorization).mutate<
    insertThemes,
    insertThemesVariables
  >({
    mutation: INSERT_THEME_SETTINGS,
    variables: {
      name: themeName,
      settings: themeSettings,
    },
    context: {
      headers: {
        authorization,
      },
    },
  });
}
