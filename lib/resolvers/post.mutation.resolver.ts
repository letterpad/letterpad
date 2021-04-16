import { Tags } from "./../../db/models/tags";
import { PostStatusOptions } from "./../../__generated__/lib/type-defs.graphqls";
import { PostAttributes } from "./../../db/models/post";
import { ResolverContext } from "./../apollo";
import reading_time from "reading-time";
import { mdToHtml } from "letterpad-editor";
import { MutationResolvers } from "../../__generated__/lib/type-defs.graphqls";

import {
  slugify,
  getDateTime,
  getImageDimensions,
  setImageWidthAndHeightInHtml,
} from "./helpers";
import config from "../../config";
import logger from "../../shared/logger";
import { updatePostOptionalArgs } from "../types";

const host = config.ROOT_URL + config.BASE_NAME;

const Mutation: MutationResolvers<ResolverContext> = {
  async createPost(_parent, args, context, _info) {
    if (!args.data || !context.models) {
      return {
        ok: false,
        post: null,
      };
    }
    // _args.data.authorId = user.id;
    args.data.slug = await slugify(context.models.Post, config.defaultSlug);
    if (!args.data.md) {
      args.data.md = "";
      args.data.html = "";
    }
    // add an empty string for title
    if (!args.data.title) {
      args.data.title = "";
    }
    const newPost = await context.models.Post.create(args.data as any);

    const defaultTags = await context.models.Tags.findOne({
      where: { id: 2 },
    });
    if (defaultTags) await newPost.addTag(defaultTags);

    return {
      ok: true,
      post: newPost.get(),
    };
  },

  async updatePost(_parent, args, context, _info) {
    if (!args.data || !context.models) {
      return {
        ok: false,
        post: null,
      };
    }
    const previousPostRaw = await context.models.Post.findOne({
      where: { id: args.data.id },
    });

    if (!previousPostRaw) {
      return {
        ok: false,
        post: {},
      };
    }

    const currentTime = getDateTime(new Date().getTime());
    const { cover_image, ...rest } = args.data;
    const data: updatePostOptionalArgs = {
      publishedAt: currentTime,
      updatedAt: currentTime,
      md_draft: "",
      reading_time: "",
      cover_image: "",
      cover_image_width: 0,
      cover_image_height: 0,
      ...rest,
    };
    if (args.data.slug) {
      data.slug = args.data.slug.replace("/post/", "").replace("/page/", "");
    }

    const previousPost = previousPostRaw.toJSON() as PostAttributes;

    // slug and title
    if (data.slug) {
      if (data.slug.length === 0) {
        const title = args.data.title || previousPost.title;
        data.slug = await slugify(context.models.Post, title);
        logger.debug("Slug changed to :", args.data.slug);
      }
    } else if (!args.data.title) {
      //
    } else if (isFirstTitleCreation(previousPost.title, args.data.title)) {
      data.slug = await slugify(context.models.Post, args.data.title);
      data.title = args.data.title || previousPost.title;
      logger.debug("Slug created:", args.data.slug);
    }

    // date and status
    if (isPublishingLive(previousPost.status, args.data.status)) {
      data.publishedAt = currentTime;
      logger.debug(
        "Post status changed from draft to published - ",
        currentTime,
      );
      data.scheduledAt = null;
    }

    // cover image
    if (args.data.cover_image) {
      const { width, height } = args.data.cover_image;
      let src = args.data.cover_image.src.replace(host, "");
      data.cover_image = src;
      if (!width && !height) {
        if (src.startsWith("/")) {
          // this is internal image
          src = host + src;
        }
        try {
          const imageSize = await getImageDimensions(src);
          data.cover_image_width = imageSize.width;
          data.cover_image_height = imageSize.height;
        } catch (e) {
          logger.error(
            `No width/height specified for cover image.
            \n Trying to get dimentions of image src`,
            src,
          );
        }
      } else {
        data.cover_image_width = width as number;
        data.cover_image_height = height as number;
      }
      logger.debug(
        "Updating cover image",
        data.cover_image,
        data.cover_image_width,
        data.cover_image_height,
      );
    } else {
      delete data.cover_image;
      delete data.cover_image_height;
      delete data.cover_image_width;
    }

    // reading time
    if (args.data.md && args.data.md !== previousPost.md) {
      // update reading time
      data.reading_time = reading_time(args.data.md).text;
      logger.debug("Reading time: ", data.reading_time);
    } else {
      delete data.reading_time;
    }

    // update content
    if (savingDraft(previousPost.status, args.data.status)) {
      data.md_draft = args.data.md;
    } else if (args.data.md && args.data.html) {
      data.md = args.data.md;
      try {
        data.html = await setImageWidthAndHeightInHtml(args.data.html);
      } catch (error) {
        logger.error(error);
      }

      // just republished
      if (rePublished(previousPost.status, args.data.status)) {
        data.md_draft = "";
      }
    } else if (rePublished(previousPost.status, args.data.status)) {
      if (previousPost.md_draft) {
        data.md = previousPost.md_draft;
        try {
          data.html = await setImageWidthAndHeightInHtml(
            mdToHtml(previousPost.md_draft),
          );
        } catch (error) {
          logger.error(error);
        }
      }
      data.md_draft = "";
    }

    if (args.data.excerpt) {
      data.excerpt = args.data.excerpt;
    }
    const tag = await context.models.Tags.findOne({ where: { id: 3 } });
    if (tag) {
      const posts = await tag.getPosts();
      console.log(posts.length);
    }

    // const prevTags = await previousPostRaw.getTags();
    if (args.data.tags && previousPostRaw) {
      logger.debug("Updating Tags", args.data.tags);

      const Tags = [...args.data.tags];

      if (Tags && Tags.length > 0) {
        logger.debug("Removing all Tags");
        // remove the tags relation
        await previousPostRaw.setTags([]);

        for (let i = 0; i < Tags.length; i++) {
          const tags = Tags[i];

          logger.info("processing tags", tags);
          let taxItem: Tags | null = null;
          // add relation with existing Tags
          if (tags.id !== 0) {
            taxItem = await context.models.Tags.findOne({
              where: { id: tags.id },
            });
            if (taxItem) {
              await previousPostRaw.addTag(taxItem);
            }
            logger.debug(`Added existing tags (${tags.name}) with id`, tags.id);
          } else {
            // Tags needs to be created
            await context.models.Tags.findOrCreate({
              where: {
                name: tags.name,
                slug: tags.name.toLowerCase(),
              },
            });
            logger.debug(`Added new tags (${tags.name})`);
            taxItem = await context.models.Tags.findOne({
              where: {
                name: tags.name,
              },
            });
            logger.debug("Linking tags to post", tags.name);
            // add relation
            if (taxItem) {
              await previousPostRaw.addTag(taxItem);
            }
          }
        }
      }
    }

    return {
      ok: true,
      post: {},
    };
  },

  // .createResolver(updateMenuOnTitleChange)
  // .createResolver(executeUpdatePost)
  // .createResolver(async (root, result) => {
  //   result.post.dataValues = normalizePost(result.post.dataValues);
  //   return result;
  // }),
};

function isFirstTitleCreation(prevTitle: string, newTitle: string) {
  if (prevTitle === "" && newTitle !== "") {
    return true;
  }
}

function isPublishingLive(
  oldStatus: PostStatusOptions | string,
  newStatus?: PostStatusOptions | null,
) {
  return (
    newStatus === PostStatusOptions.Published &&
    oldStatus === PostStatusOptions.Draft
  );
}

function rePublished(
  prevStatus: PostStatusOptions,
  currentStatus?: PostStatusOptions | null,
) {
  return (
    prevStatus === PostStatusOptions.Published &&
    currentStatus === PostStatusOptions.Published
  );
}
function savingDraft(
  prevStatus: PostStatusOptions,
  statusArg?: PostStatusOptions | null,
) {
  return !statusArg && prevStatus === PostStatusOptions.Published;
}
export default { Mutation };
