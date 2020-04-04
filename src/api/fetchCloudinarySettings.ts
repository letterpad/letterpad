import { Op } from "sequelize";
import { SettingOptions } from "../__generated__/gqlTypes";

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
