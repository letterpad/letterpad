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
import { getModifiedSession } from "./helpers";
import { Op } from "sequelize";

type ValueOf<T> = T[keyof T];
const SECURE_SETTINGS = [
  "cloudinary_key",
  "cloudinary_name",
  "cloudinary_secret",
];

const cssPath = path.join(process.cwd(), "public/css/custom.css");
const Query: QueryResolvers<ResolverContext> = {
  settings: async (_root, _args = {}, context) => {
    const session = await getModifiedSession(context);

    const where = [];
    if (session?.user.id) {
      where.push({ id: session.user.id });
    } else if (context.clientEmail) {
      where.push({ email: context.clientEmail });
    }
    const author = await models.Author.findOne({
      where: {
        [Op.or]: where,
      },
    });

    const setting = await author?.getSetting();

    if (!setting) return {} as Setting;

    SECURE_SETTINGS.forEach(securedKey => {
      if (!session?.user) {
        setting.setDataValue(securedKey, "");
      }
    });

    return (setting.get() as unknown) as Setting;
  },
};
const Mutation: MutationResolvers<ResolverContext> = {
  updateOptions: async (_root, args, context) => {
    const session = await getModifiedSession(context);

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
