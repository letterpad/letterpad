import { requiresAdmin } from "../utils/permissions";
import utils from "../../shared/util";

export default {
  Query: {
    settings: (root, args, { models }) => {
      return models.Setting.findAll({ where: args });
    },
  },
  Mutation: {
    updateOptions: requiresAdmin.createResolver(
      async (root, args, { models }) => {
        let promises = args.options.map(setting => {
          if (setting.option === "css") {
            require("fs").writeFileSync(
              require("path").join(__dirname, "../../public/css/custom.css"),
              setting.value,
            );
          }
          return models.Setting.update(setting, {
            where: { option: setting.option },
          });
        });
        await Promise.all(promises);
        return models.Setting.findAll();
      },
    ),
  },
};

export const updateMenuItem = async (models, id, type, field) => {
  let menu = await models.Setting.findOne({
    where: { option: "menu" },
  });

  const changeMenuItem = item => {
    if (item.type === type) {
      item = { ...item, ...field };
    }
    return item;
  };
  // loop though the menu and find the item with the current slug and id.
  // if found, update the slug
  const updatedMenu = JSON.parse(menu.value).map(item =>
    utils.recurseMenu(item, id, changeMenuItem),
  );

  try {
    await models.Setting.update(
      { value: JSON.stringify(updatedMenu) },
      { where: { option: "menu" } },
    );
  } catch (e) {
    console.log(e);
  }
};
