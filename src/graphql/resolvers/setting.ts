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
import config from "../../../config";

const SECURE_SETTINGS = [
  "cloudinary_key",
  "cloudinary_name",
  "cloudinary_secret",
];
const host = config.ROOT_URL + config.BASE_NAME;

const cssPath = path.join(process.cwd(), "public/css/custom.css");
const Query: QueryResolvers<ResolverContext> = {
  settings: async (_root, args = {}, context) => {
    const settings = await models.Setting.findAll({
      where: args,
    });
    const data = {};

    settings.forEach(setting => {
      const { option, value } = setting.get();
      data[option] = value;

      if (SECURE_SETTINGS.includes(setting.option) && !context.session) {
        data[option] = "";
      }
    });

    return data as Setting;
  },
};
const Mutation: MutationResolvers<ResolverContext> = {
  updateOptions: async (_root, args, context) => {
    const session = await getModifiedSession(context);

    if (!session) return {} as Setting;

    let promises = args.options.map(setting => {
      const option = Object.keys(setting)[0];
      let value = Object.values(setting)[0];

      if (setting.css) {
        fs.writeFileSync(cssPath, setting.css);
      }

      if (["banner", "site_logo", "site_favicon"].includes(option)) {
        value = value as InputImage;
        if (value && !value.src.startsWith(host)) {
          value.src = value.src.replace(host, "");
          value = JSON.stringify(value);
        }
      } else if (option === "menu") {
        value = JSON.stringify(value);
      }

      return models.Setting.update(
        { value: value as string },
        {
          where: { option },
        },
      );
    });
    try {
      await Promise.all(promises);
    } catch (e) {
      console.log("e :>> ", e);
    }

    const settings = await models.Setting.findAll();

    const data = {};
    settings.forEach(setting => {
      data[setting.option] = setting.get().value;
    });
    return data as Setting;
  },
};

export default { Query, Mutation };
