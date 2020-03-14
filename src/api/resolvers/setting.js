import config from "../../config";
import { requiresAdmin } from "../utils/permissions";
import utils from "../../shared/util";

const host = config.ROOT_URL + config.BASE_NAME;

function getMenuWithSanitizedSlug(menu) {
  const parsedMenu = JSON.parse(menu);
  const menuWithSanitizedSlug = parsedMenu.map((item, i) => {
    let to = "/posts/" + item.slug;

    if (item.type === "page") {
      to = "/page/" + item.slug;
    }
    item.slug = to;
    return item;
  });
  return JSON.stringify(menuWithSanitizedSlug);
}

const SECURE_SETTINGS = [
  "cloudinary_key",
  "cloudinary_name",
  "cloudinary_secret",
];

export default {
  Query: {
    settings: async (root, args, { models, user }) => {
      const settings = await models.Setting.findAll({ where: args });
      return settings.map(item => {
        if (["site_logo", "site_favicon"].includes(item.option)) {
          if (item.value && !item.value.startsWith("http")) {
            item.value = host + item.value;
          }
        }
        if (["banner"].includes(item.option)) {
          let value = { src: "", width: 0, height: 0 };
          try {
            let parsedValue = JSON.parse(item.value);
            if (parsedValue.src && !parsedValue.src.startsWith("http")) {
              parsedValue.src = host + parsedValue.src;
            }
            value = parsedValue;
          } catch (e) {
            // no action
          }
          item.value = JSON.stringify(value);
        }
        if (item.option === "menu") {
          item.value = getMenuWithSanitizedSlug(item.value);
        }
        if (!user && !user.id) {
          if (SECURE_SETTINGS.includes(item.option)) {
            // item.value = "xxx-xxx-xxx";
          }
        }

        return item;
      });
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
          } else if (["site_logo", "site_favicon"].includes(setting.option)) {
            setting.value = setting.value.replace(host, "");
          } else if (["banner"].includes(setting.option)) {
            let value = { src: "", width: 0, height: 0 };
            try {
              let parsedValue = JSON.parse(setting.value);
              if (parsedValue.src && !parsedValue.src.startsWith(host)) {
                parsedValue.src = parsedValue.src.replace(host, "");
              }
              value = parsedValue;
            } catch (e) {
              console.log(e);
              // no action
            }
            setting.value = JSON.stringify(value);
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
