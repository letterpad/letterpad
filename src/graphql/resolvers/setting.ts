import { Navigation } from "./../../../__generated__/src/graphql/type-defs.graphqls";
import { ResolverContext } from "../apollo";
import type {
  QueryResolvers,
  MutationResolvers,
  Setting as SettingType,
  InputImage,
} from "@/__generated__/type-defs.graphqls";
import fs from "fs";
import path from "path";
import models from "../db/models";

type ValueOf<T> = T[keyof T];
const SECURE_SETTINGS = [
  "cloudinary_key",
  "cloudinary_name",
  "cloudinary_secret",
];

const cssPath = path.join(process.cwd(), "public/css/custom.css");

const Setting = {
  menu: ({ menu }) => {
    return getMenuWithSanitizedSlug(JSON.parse(menu as string));
  },

  banner: ({ banner }) => {
    const img = JSON.parse(banner as string);
    if (img.src && !img.src.startsWith("http")) {
      img.src = process.env.ROOT_URL + img.src;
    }
    return img;
  },

  site_logo: ({ site_logo }) => {
    const img = JSON.parse(site_logo as string);
    if (img.src && !img.src.startsWith("http")) {
      img.src = process.env.ROOT_URL + img.src;
    }
    return img;
  },

  site_favicon: ({ site_favicon }) => {
    const img = JSON.parse(site_favicon as string);
    if (img.src && !img.src.startsWith("http")) {
      img.src = process.env.ROOT_URL + img.src;
    }
    return img;
  },
};

const Query: QueryResolvers<ResolverContext> = {
  settings: async (_root, _args = {}, { session, author_id }) => {
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

    const setting = await author?.getSetting();

    if (!setting)
      return {
        __typename: "SettingError",
        message: "Setting related to author:null not found",
      };

    SECURE_SETTINGS.forEach(securedKey => {
      if (!session?.user.id) {
        setting.setDataValue(securedKey, "");
      }
    });

    return {
      __typename: "Setting",
      ...((setting as unknown) as SettingType),
    };
  },
};
const Mutation: MutationResolvers<ResolverContext> = {
  updateOptions: async (_root, args, { session }) => {
    if (!session?.user.id) return {} as SettingType;

    const author = await models.Author.findOne({
      where: { id: session.user.id },
    });

    if (!author) return {};
    const _setting = await author.getSetting();

    let promises = args.options.map(setting => {
      const option = Object.keys(setting)[0] as keyof Omit<
        SettingType,
        "__typename"
      >;
      let value = Object.values(setting)[0] as ValueOf<SettingType>;

      if (setting.css) {
        fs.writeFileSync(cssPath, setting.css);
      }

      if (setting.banner || setting.site_logo || setting.site_favicon) {
        value = value as InputImage;
        if (value && !value.src.startsWith(process.env.ROOT_URL)) {
          value.src = value.src.replace(process.env.ROOT_URL, "");
          value = JSON.stringify(value);
        }
      } else if (setting.menu) {
        value = JSON.stringify(value);
      }

      // return _setting?.setDataValue(option, value);
      return models.Setting.update(
        { [option]: value },
        { where: { id: _setting.id }, logging: true },
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
    const a = (setting as unknown) as SettingType;

    return a;
  },
};

export default { Query, Mutation, Setting };

function getMenuWithSanitizedSlug(menu: Navigation[]) {
  return menu.map(item => {
    switch (item.type) {
      case "tag":
      case "page":
        item.slug = "/" + item.type + "/" + item.slug;
        break;
      case "custom":
        item.slug = item.slug;
        break;
    }
    return item;
  });
}
