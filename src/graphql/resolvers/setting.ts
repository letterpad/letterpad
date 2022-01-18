//@ts-nocheck
import {
  QueryResolvers,
  MutationResolvers,
  Setting as SettingType,
  InputImage,
  Navigation,
  Role,
} from "@/__generated__/__types__";
import fs from "fs";
import path from "path";
import logger from "@/shared/logger";
import { defaultSettings } from "../db/seed/constants";
import { ResolverContext } from "../context";

type ValueOf<T> = T[keyof T];
const SECURE_SETTINGS = [
  "cloudinary_key",
  "cloudinary_name",
  "cloudinary_secret",
];

const cssPath = path.join(process.cwd(), "public/css/custom.css");

const Setting = {
  menu: ({ menu }) => {
    menu = parse(menu);
    return getMenuWithSanitizedSlug(menu);
  },

  banner: ({ banner }) => {
    banner = parse(banner);
    if (banner.src && !banner.src.startsWith("http")) {
      banner.src = process.env.ROOT_URL + banner.src;
    }
    return banner;
  },

  site_logo: ({ site_logo }) => {
    site_logo = parse(site_logo);
    if (site_logo.src && !site_logo.src.startsWith("http")) {
      site_logo.src = process.env.ROOT_URL + site_logo.src;
    }
    return site_logo;
  },

  site_favicon: ({ site_favicon }) => {
    site_favicon = parse(site_favicon);
    if (site_favicon.src && !site_favicon.src.startsWith("http")) {
      site_favicon.src = process.env.ROOT_URL + site_favicon.src;
    }
    return site_favicon;
  },
};

const Query: QueryResolvers<ResolverContext> = {
  settings: async (_root, _args = {}, { session, author_id, models }) => {
    const authorId = session?.user.id || author_id;
    if (!authorId) {
      return {
        __typename: "SettingError",
        message: "Setting related to author:null not found",
      };
    }
    const author = await models.Author.findOne({
      where: { id: authorId },
    });

    const setting = await author?.$get("setting");
    if (!setting)
      return {
        __typename: "SettingError",
        message: "Setting related to author:null not found",
      };

    SECURE_SETTINGS.forEach((securedKey) => {
      if (!session?.user.id) {
        setting.setDataValue(securedKey, "");
      }
    });

    return { ...setting.get(), __typename: "Setting" };
  },
};
const Mutation: MutationResolvers<ResolverContext> = {
  updateOptions: async (_root, args, { session, models }) => {
    if (!session?.user.id)
      return {
        ...defaultSettings,
        menu: defaultSettings.menu as any,
      };

    const author = await models.Author.findOne({
      where: { id: session.user.id },
    });

    if (!author) return defaultSettings;
    const _setting = await author.$get("setting");

    let promises = args.options.map((setting) => {
      const option = Object.keys(setting)[0] as keyof Omit<
        SettingType,
        "__typename"
      >;
      let value = Object.values(setting)[0] as ValueOf<SettingType>;

      if (setting.css) {
        fs.writeFileSync(cssPath, setting.css);
      }

      if (setting.google_analytics && session.user.role === Role.Admin) {
      }
      if (setting.banner || setting.site_logo || setting.site_favicon) {
        value = value as InputImage;
        if (value && value.src?.startsWith(process.env.ROOT_URL)) {
          value.src = value.src?.replace(process.env.ROOT_URL, "");
        }
      }
      const setting_id = _setting?.get().id;
      logger.info(
        `Updating settings with id ${setting_id}- ` + option + " : " + value,
      );
      return models.Setting.update(
        { [option]: value },
        { where: { id: setting_id } },
      );
    });

    try {
      await Promise.all(promises);
    } catch (e) {
      console.log("e :>> ", e);
    }

    const setting = await models.Setting.findOne({
      where: { id: session.user.id },
    });
    if (!setting) {
      return defaultSettings;
    }

    return {
      ...setting.get(),
    } as unknown as SettingType;
  },
};

export default { Query, Mutation, Setting };

function getMenuWithSanitizedSlug(menu: Navigation[]) {
  return menu.map((item) => {
    switch (item.type) {
      case "tag":
      case "page":
        item.slug = "/" + item.type + "/" + item.slug;
        break;
    }
    return item;
  });
}

const parse = (str: string | object) => {
  return typeof str === "string" ? JSON.parse(str) : str;
};
