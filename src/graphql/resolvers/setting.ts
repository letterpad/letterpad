import {
  MutationResolvers,
  Navigation,
  QueryResolvers,
  SettingResolvers,
} from "@/__generated__/__types__";
import { ResolverContext } from "@/graphql/context";
import { Optional } from "@/shared/types";

import {
  getSetting,
  resolveImageField,
  updateSetting,
} from "../services/setting";

const Setting: SettingResolvers<ResolverContext> = {
  menu: ({ menu }) => getMenuWithSanitizedSlug(parse(menu)),
  banner: ({ banner }) => resolveImageField(banner),
  site_logo: ({ site_logo }) => resolveImageField(site_logo),
  site_favicon: ({ site_favicon }) => resolveImageField(site_favicon),
};

const Query: QueryResolvers<ResolverContext> = {
  settings: async (_root, args = {}, context) => getSetting(args, context),
};
const Mutation: Optional<MutationResolvers<ResolverContext>> = {
  updateOptions: async (_root, args, context) => updateSetting(args, context),
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
