//@ts-nocheck
import reading_time from "reading-time";

import { PostStatusOptions, PostTypes } from "@/__generated__/__types__";
import { defaultSettings } from "@/graphql/db/seed/constants";
import { SessionData } from "@/graphql/types";

import { Optional } from "./../../../../shared/types";
import { IGhostDb, IGhostSettings, IImportExportGhostData } from "./types";
import {
  IAuthorData,
  IImportExportData,
  ITagSanitized,
} from "../../../../components/import-export/importExportTypes";

export function convertGhostToLetterpad(
  data: IImportExportGhostData,
  user: SessionData,
): IImportExportData {
  const posts: IAuthorData["posts"] = [];
  const author = getAuthor(data.db[0].data.users, user);

  if (!author) {
    throw new Error("Author not found");
  }
  const postTagsMapper = getPostTagsMapper(data.db[0].data);

  data.db[0].data.posts.forEach((post) => {
    posts.push({
      title: post.title || "",
      excerpt: post.meta_description || "",
      cover_image: post.feature_image || "",
      featured: !!post.featured,
      html: post.html,
      updatedAt: post.updated_at,
      publishedAt: post.published_at,
      createdAt: post.created_at,
      type: post.page ? PostTypes.Page : PostTypes.Post,
      slug: post.slug,
      html_draft: "",
      status: post.status as PostStatusOptions,
      cover_image_height: 0,
      cover_image_width: 0,
      reading_time: reading_time(post.html).text,
      tags: postTagsMapper[post.id] || [],
    });
  });

  const setting = getSetting(data.db[0].data.settings);
  return {
    authors: {
      [author.email]: {
        author,
        media: [],
        posts,
        tags: [],
        setting,
      },
    },
  };
}

function getPostTagsMapper(data: IGhostDb["data"]) {
  const mapper: { [id: number]: ITagSanitized[] } = {};

  data.posts_tags.forEach((relation) => {
    if (!mapper[relation.post_id]) {
      mapper[relation.post_id] = [
        {
          slug: "home",
          name: "Home",
        },
      ] as ITagSanitized[];
    }
    const tagId = relation.tag_id;
    const tag = data.tags
      .filter((_tag) => _tag.id === tagId)
      .map((_tag) => {
        return {
          slug: _tag.slug,
          name: _tag.name,
        };
      })
      .pop();
    if (tag) {
      mapper[relation.post_id].push(tag);
    }
  });

  return mapper;
}

function getAuthor(
  users: IGhostDb["data"]["users"],
  session: SessionData,
): IAuthorData["author"] | null {
  const author = users.pop();

  if (author) {
    return {
      name: author.name,
      bio: author.bio,
      email: session.email,
      avatar: author.image,
      createdAt: author.created_at,
      updatedAt: author.updated_at,
      verified: true,
      password: "",
      username: session.username,
      social: {},
    };
  }
  return null;
}

function getSetting(setting: IGhostSettings[]): IAuthorData["setting"] {
  const ghostSettingObj: Optional<IAuthorData["setting"]> = {};
  setting.forEach((item) => {
    if (item.key === "cover") {
      ghostSettingObj.banner = {
        src: item.value,
        width: 0,
        height: 0,
      };
    }
    if (item.key === "description") {
      ghostSettingObj.site_description = item.value;
    }
    if (item.key === "email") {
      ghostSettingObj.site_email = item.value;
    }

    if (item.key === "logo") {
      ghostSettingObj.site_logo = {
        src: item.value,
        width: 0,
        height: 0,
      };
    }
    if (item.key === "title") {
      ghostSettingObj.site_title = item.value;
    }
  });

  return {
    ...defaultSettings,
    menu: [...defaultSettings.menu] as any,
    ...ghostSettingObj,
  };
}
