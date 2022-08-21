import {
  MutationResolvers,
  Navigation,
  QueryResolvers,
  Setting as SettingType,
} from "@/__generated__/__types__";
import logger from "@/shared/logger";

import { mapSettingToGraphql } from "./mapper";
import { ResolverContext } from "../context";

type ValueOf<T> = T[keyof T];
const SECURE_SETTINGS = [
  "cloudinary_key",
  "cloudinary_name",
  "cloudinary_secret",
];

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
  settings: async (_root, _args = {}, { session, author_id, prisma }) => {
    const authorId = session?.user.id || author_id;

    if (authorId) {
      const author = await prisma.author.findFirst({
        where: { id: authorId },
        include: {
          setting: true,
        },
      });

      if (author && author.setting) {
        SECURE_SETTINGS.forEach((securedKey: any) => {
          if (!session?.user.id && author.setting) {
            author.setting[securedKey] = "";
          }
        });
        return { ...mapSettingToGraphql(author.setting) };
      }
    }

    return {
      __typename: "SettingError",
      message: `Setting related to author:${authorId} not found`,
    };
  },
};
const Mutation: MutationResolvers<ResolverContext> = {
  updateOptions: async (_root, args, { session, prisma, author_id }) => {
    author_id = session?.user.id || author_id;
    if (author_id) {
      const author = await prisma.author.findFirst({
        where: { id: author_id },
        include: {
          setting: true,
        },
      });
      const setting_id = author?.setting?.id;
      if (!setting_id)
        return { __typename: "SettingError", message: "Setting now found" };

      const promises = args.options.map((setting) => {
        const option = Object.keys(setting)[0] as keyof Omit<
          SettingType,
          "__typename"
        >;
        let value = Object.values(setting)[0] as ValueOf<SettingType>;

        if (option === "css") {
          setting.css = (value as string) || "";
        }
        const isImageOption =
          setting.banner || setting.site_logo || setting.site_favicon;

        const internalImage = isImageOption?.src.startsWith(
          process.env.ROOT_URL,
        );
        if (isImageOption && internalImage) {
          isImageOption.src = isImageOption.src?.replace(
            process.env.ROOT_URL,
            "",
          );

          value = JSON.stringify(isImageOption);
        }
        if (["menu", "banner", "site_logo", "site_favicon"].includes(option)) {
          value = JSON.stringify(value);
        }
        logger.info(
          `Updating settings with id ${setting_id}- ` + option + " : " + value,
        );

        return prisma.setting.update({
          data: {
            [option]: value,
          },
          where: { id: setting_id },
        });
      });

      await Promise.all(promises);

      const setting = await prisma.setting.findUnique({
        where: { id: setting_id },
      });
      if (setting) {
        return {
          ...mapSettingToGraphql(setting),
          site_url: `https://${author?.username}.letterpad.app`,
          __typename: "Setting",
        };
      }
      throw Error("Couldnt find setting");
    }
    return {
      message: "You are not authorized",
      __typename: "SettingError",
    };
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
