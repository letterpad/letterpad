import {
  MutationResolvers,
  Navigation,
  NavigationType,
  QueryResolvers,
  SettingResolvers,
} from "letterpad-graphql";

import { ResolverContext } from "@/graphql/context";
import { getRootUrl } from "@/shared/getRootUrl";

import {
  getSetting,
  resolveImageField,
  updateSetting,
} from "../services/setting";
import { resolveDesignField } from "../services/setting/resolveDesignField";

import { Optional } from "@/types";

const Setting: SettingResolvers<ResolverContext> = {
  menu: async (
    { menu, show_about_page, show_tags_page },
    _,
    { dataloaders, client_author_id, session }
  ) => {
    const author = await dataloaders.author.load(
      session?.user.id || client_author_id
    );
    return getMenuWithSanitizedSlug(
      parse(menu),
      !!session?.user,
      author.username,
      show_about_page,
      show_tags_page
    );
  },
  banner: ({ banner }) => resolveImageField(banner),
  site_logo: ({ site_logo }) => resolveImageField(site_logo),
  site_favicon: ({ site_favicon }) => resolveImageField(site_favicon),
  design: ({ design }) => resolveDesignField(design),
  client_token: (__, _, { session }) => {
    return session?.user.id!
  },
  is_platform: () => process.env.LETTERPAD_PLATFORM === "true",
  site_url: async ({ site_url }, _, { session, dataloaders, client_author_id }) => {
    try {
      new URL(site_url)
      return site_url;
    } catch (e) {
      //
    }

    const author = await dataloaders.author.load(
      session?.user.id || client_author_id
    );
    return 'https://' + author.username + '.' + new URL(getRootUrl()).hostname

  },
  logged_in: (_, __, { session }) => {
    return !!session?.user?.id;
  }
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
  username: string,
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
      slug: new URL(`@${username}`, getRootUrl()).href,
      label: "About",
      type: NavigationType.Custom,
      original_name: "About",
    });
  }

  return cleanMenu;
}

const parse = (str: string | object) => {
  return typeof str === "string" ? JSON.parse(str) : str;
};
