import config from "../../config";
import { requiresAdmin } from "../utils/permissions";
import utils from "../../shared/util";

const host = config.ROOT_URL + config.BASE_NAME;

function getMenuWithSanitizedSlug(menu) {
  const navigationData = JSON.parse(menu);

  return navigationData.map(item => {
    switch (item.type) {
      case "tag":
      case "page":
        item.slug = config.BASE_NAME + "/" + item.type + "/" + item.slug;
        break;
      case "custom":
        item.slug = config.BASE_NAME + "/" + item.slug;
        break;
    }
    return item;
  });
}

const SECURE_SETTINGS = [
  "cloudinary_key",
  "cloudinary_name",
  "cloudinary_secret",
];

export default {
  Query: {
    settings: async (root, args, { models, user }) => {
      const settings = await models.Setting.findAll({ where: args, raw: true });
      return normalizeSettings(settings, user);
    },
  },
  Mutation: {
    updateOptions: requiresAdmin.createResolver(
      async (root, args, { models, user }) => {
        let promises = args.options.map(setting => {
          const option = Object.keys(setting)[0];
          let value = Object.values(setting)[0];

          if (setting.css) {
            require("fs").writeFileSync(
              require("path").join(__dirname, "../../public/css/custom.css"),
              setting.css,
            );
          } else if (
            setting.banner ||
            setting.site_logo ||
            setting.site_favicon
          ) {
            let value = { src: "", width: 0, height: 0 };
            try {
              if (value.src && !value.src.startsWith(host)) {
                value.src = value.src.replace(host, "");
              }
            } catch (e) {
              console.log(e);
              // no action
            }
            value = JSON.stringify(value);
          } else if (setting.menu) {
            value = JSON.stringify(setting.menu);
          }

          return models.Setting.update(
            { value: value },
            {
              where: { option: option },
            },
          );
        });
        await Promise.all(promises);
        const settings = await models.Setting.findAll();
        return normalizeSettings(settings, user);
      },
    ),
  },
};

function normalizeSettings(settings, user) {
  const data = {};
  settings.forEach(item => {
    if (["banner", "site_logo", "site_favicon"].includes(item.option)) {
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
      item.value = value;
    }
    if (item.option === "menu") {
      item.value = getMenuWithSanitizedSlug(item.value);
    }
    if (!user && !user.id) {
      if (SECURE_SETTINGS.includes(item.option)) {
        // item.value = "xxx-xxx-xxx";
        console.log("not found");
      }
    }
    data[item.option] = item.value;
  });
  return data;
}
