import { ResolverContext } from "../apollo";
import {
  QueryResolvers,
  MutationResolvers,
  Setting,
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
      ...((setting.get() as unknown) as Setting),
    };
  },
};
const Mutation: MutationResolvers<ResolverContext> = {
  updateOptions: async (_root, args, { session }) => {
    if (!session?.user) return {} as Setting;

    const author = await models.Author.findOne({
      where: { id: session.user.id },
    });
    const _setting = await author?.getSetting();

    let promises = args.options.map(setting => {
      const option = Object.keys(setting)[0] as keyof Omit<
        Setting,
        "__typename"
      >;
      let value = Object.values(setting)[0] as ValueOf<Setting>;

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

      return _setting?.setDataValue(option, value);
    });

    try {
      await Promise.all(promises);
    } catch (e) {
      console.log("e :>> ", e);
    }

    const setting = await models.Setting.findOne({
      where: { id: session.user.id },
    });

    return (setting as unknown) as Setting;
  },
};

export default { Query, Mutation };
