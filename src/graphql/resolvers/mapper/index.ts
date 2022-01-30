import {
  PostStatusOptions,
  PostTypes,
  Post,
  Author,
  SettingInputType,
} from "@/__generated__/__types__";
import {
  Post as DbPost,
  Author as DbAuthor,
  Setting as DbSetting,
} from "@prisma/client";

export const mapPostToGraphql = (post: DbPost) => {
  return {
    ...post,
    cover_image: {
      src: post.cover_image,
      width: post.cover_image_width,
      height: post.cover_image_height,
    },
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
        }),
    ),
    __typename: "Author",
  } as Author & T;
};

export const mapSettingToDb = (setting: SettingInputType) => {
  return {
    ...setting,
    menu: JSON.stringify(setting.menu),
    banner: JSON.stringify(setting.banner),
    site_favicon: JSON.stringify(setting.site_favicon),
    site_logo: JSON.stringify(setting.site_logo),
  } as DbSetting;
};
