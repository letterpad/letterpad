import {
  MutationResolvers,
  Navigation,
  NavigationType,
  QueryResolvers,
  SettingResolvers,
} from "@/__generated__/__types__";
import { ResolverContext } from "@/graphql/context";

import {
  getSetting,
  resolveImageField,
  updateSetting,
} from "../services/setting";
import { resolveDesignField } from "../services/setting/resolveDesignField";

import { Optional } from "@/types";
import { encryptEmail } from "../../shared/clientToken";

const Setting: SettingResolvers<ResolverContext> = {
  menu: ({ menu, show_about_page, show_tags_page }, _, context) =>
    getMenuWithSanitizedSlug(
      parse(menu),
      !!context.session?.user,
      show_about_page,
      show_tags_page
    ),
  banner: ({ banner }) => resolveImageField(banner),
  site_logo: ({ site_logo }) => resolveImageField(site_logo),
  site_favicon: ({ site_favicon }) => resolveImageField(site_favicon),
  design: ({ design }) => resolveDesignField(design),
  client_token: ({ }, _, { session }) => {
    return session?.user.email ? encryptEmail(session?.user.email) : ""
  },
};

const Query: QueryResolvers<ResolverContext> = {
  settings: async (_root, args = {}, context) => getSetting(args, context),
};
const Mutation: Optional<MutationResolvers<ResolverContext>> = {
  updateOptions: async (_root, args, context) => updateSetting(args, context),
};

export default { Query, Mutation, Setting };

function getMenuWithSanitizedSlug(
  menu: Navigation[],
  loggedIn: boolean,
  show_about_page?: boolean,
  show_tags_page?: boolean
) {
  const cleanMenu = menu.map((item) => {
    switch (item.type) {
      case "tag":
      case "page":
        item.slug = "/" + item.type + "/" + item.slug;
        break;
    }
    return item;
  });
  if (loggedIn) return cleanMenu;

  if (show_tags_page) {
    cleanMenu.push({
      slug: "/tags",
      label: "Tags",
      type: NavigationType.Page,
      original_name: "Tags",
    });
  }
  if (show_about_page) {
    cleanMenu.push({
      slug: "/about",
      label: "About",
      type: NavigationType.Page,
      original_name: "About",
    });
  }

  return cleanMenu;
}

const parse = (str: string | object) => {
  return typeof str === "string" ? JSON.parse(str) : str;
};
