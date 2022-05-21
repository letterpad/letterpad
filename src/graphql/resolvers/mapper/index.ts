import {
  PostStatusOptions,
  PostTypes,
  Post,
  Author,
  SettingInputType,
  Setting,
} from "@/__generated__/__types__";
import {
  Post as DbPost,
  Author as DbAuthor,
  Setting as DbSetting,
} from "@prisma/client";

export const mapPostToGraphql = (post: DbPost) => {
  return {
    ...post,
    type: post.type as PostTypes,
    status: post.status as PostStatusOptions,
    __typename: "Post",
  } as Post;
};

export const mapAuthorToGraphql = <T extends DbAuthor>(author: T) => {
  return {
    ...author,
    social: JSON.parse(
      author.social ||
        JSON.stringify({
          twitter: "",
          facebook: "",
          github: "",
          instagram: "",
          linkedin: "",
        }),
    ),
    __typename: "Author",
  } as Author & T;
};

export const mapSettingToDb = (setting: SettingInputType) => {
  return removeUndefined({
    ...setting,
    menu: JSON.stringify(setting.menu),
    banner: JSON.stringify(setting.banner),
    site_favicon: JSON.stringify(setting.site_favicon),
    site_logo: JSON.stringify(setting.site_logo),
  }) as DbSetting;
};

export const mapSettingToGraphql = (setting: DbSetting) => {
  return {
    ...setting,
    menu: JSON.parse(setting.menu),
    banner: JSON.parse(setting.banner),
    logo: JSON.parse(setting.site_logo),
    cover_image: JSON.parse(setting.site_favicon),
    __typename: "Setting",
  } as Setting;
};

function removeUndefined<T>(obj: T) {
  return JSON.parse(JSON.stringify(obj));
}
