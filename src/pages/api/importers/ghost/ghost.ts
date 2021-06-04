import { Optional } from "../../../../../shared/types";
import { settingsData } from "@/graphql/db/models/setting";
import { SessionData } from "@/graphql/types";
import {
  PostStatusOptions,
  PostTypes,
} from "@/__generated__/type-defs.graphqls";
import {
  IImportExportData,
  IAuthorData,
  ITagSanitized,
} from "../../importExportTypes";
import { IGhostDb, IGhostSettings, IImportExportGhostData } from "./ghost.d";
import { mdToHtml } from "letterpad-editor";

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

  data.db[0].data.posts.forEach(post => {
    posts.push({
      title: post.title || "",
      excerpt: post.meta_description || "",
      cover_image: post.image || "",
      featured: !!post.featured,
      md: post.markdown,
      html: mdToHtml(post.markdown),
      updatedAt: post.updated_at,
      publishedAt: post.published_at,
      createdAt: post.created_at,
      type: post.page ? PostTypes.Page : PostTypes.Post,
      slug: post.slug,
      md_draft: "",
      status: post.status as PostStatusOptions,
      cover_image_height: 0,
      cover_image_width: 0,
      reading_time: "",
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

  data.posts_tags.forEach(relation => {
    if (!mapper[relation.post_id]) {
      mapper[relation.post_id] = [] as ITagSanitized[];
    }
    const tagId = relation.tag_id;
    const tag = data.tags
      .filter(_tag => _tag.id === tagId)
      .map(_tag => {
        return {
          slug: _tag.slug,
          name: _tag.name,
          desc: _tag.description,
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
      social: JSON.stringify({}),
    };
  }
  return null;
}

function getSetting(setting: IGhostSettings[]): IAuthorData["setting"] {
  const ghostSettingObj: Optional<IAuthorData["setting"]> = {};
  setting.forEach(item => {
    if (item.key === "cover") {
      ghostSettingObj.banner = JSON.stringify({
        src: item.value,
        width: 0,
        height: 0,
      });
    }
    if (item.key === "description") {
      ghostSettingObj.site_description = item.value;
    }
    if (item.key === "email") {
      ghostSettingObj.site_email = item.value;
    }

    if (item.key === "logo") {
      ghostSettingObj.site_logo = JSON.stringify({
        src: item.value,
        width: 0,
        height: 0,
      });
    }
    if (item.key === "title") {
      ghostSettingObj.site_title = item.value;
    }
  });
  return {
    ...settingsData,
    ...ghostSettingObj,
  };
}
