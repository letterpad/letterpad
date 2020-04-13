import { Op } from "sequelize";

export const getCloudinarySettings = async settingModel => {
  const settings = await settingModel.findAll({
    raw: true,
    attributes: ["value"],
    where: {
      option: {
        [Op.or]: ["cloudinary_key", "cloudinary_name", "cloudinary_secret"],
      },
    },
  });
  return {
    cloudinary_key: settings[0].value,
    cloudinary_name: settings[1].value,
    cloudinary_secret: settings[2].value,
  };
};
