import { SettingOptions, SettingsQuery } from "./../__generated__/gqlTypes";

import { Op } from "sequelize";
import { QUERY_SETTINGS } from "../shared/queries/Queries";
import { TypeSettings } from "../client/types";
import apolloClient from "../shared/apolloClient";

const client = apolloClient(false, { ssrMode: true });

export const fetchSettings = async () => {
  // get the settings data. It contains information about the theme that we want to render.
  const settings = await client.query<SettingsQuery>({
    query: QUERY_SETTINGS,
    fetchPolicy: "network-only",
  });
  const formattedSettings: TypeSettings | {} = {};
  settings.data.settings.forEach(item => {
    formattedSettings[item.option] = item;
  });

  return formattedSettings as TypeSettings;
};

export const getCloudinarySettings = async settingModel => {
  const settings = await settingModel.findAll({
    raw: true,
    attributes: ["value"],
    where: {
      option: {
        [Op.or]: [
          SettingOptions.CloudinaryKey,
          SettingOptions.CloudinaryName,
          SettingOptions.CloudinarySecret,
        ],
      },
    },
  });
  return {
    cloudinary_key: settings[0].value,
    cloudinary_name: settings[1].value,
    cloudinary_secret: settings[2].value,
  };
};
