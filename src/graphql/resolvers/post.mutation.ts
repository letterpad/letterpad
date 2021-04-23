import { Tags } from "../db/models/tags";
import {
  PostStatusOptions,
  PostTypes,
} from "../../../__generated__/src/graphql/type-defs.graphqls";
import { PostAttributes } from "../db/models/post";
import { ResolverContext } from "../apollo";
import reading_time from "reading-time";
import { mdToHtml } from "letterpad-editor";
import { MutationResolvers } from "../../../__generated__/src/graphql/type-defs.graphqls";

import {
  slugify,
  getDateTime,
  getImageDimensions,
  setImageWidthAndHeightInHtml,
  getModifiedSession,
} from "./helpers";
import config from "../../../config";
import logger from "../../../shared/logger";
import models from "../db/models";

const host = config.ROOT_URL + config.BASE_NAME;

const Mutation: MutationResolvers<ResolverContext> = {
  async createPost(_parent, args, context, _info) {
    const session = await getModifiedSession(context);

    if (!args.data || !session) {
      return {
        ok: false,
        post: {},
      };
    }
    const author = await models.Author.findOne({
      where: { id: session.user.id },
    });
    args.data.slug = await slugify(models.Post, config.defaultSlug);
    if (!args.data.md) {
      args.data.md = "";
      args.data.html = "";
    }
    // add an empty string for title
    if (!args.data.title) {
      args.data.title = "";
    }
    const newPost = await author?.createPost(args.data as any);

    const defaultTags = await models.Tags.findOne({
      where: { id: 2 },
    });
    if (defaultTags) await newPost?.addTag(defaultTags);

    return {
      ok: true,
      post: newPost?.get(),
      errors: [],
    };
  },

  async updatePost(_parent, args, _context, _info) {
    if (!args.data) {
      return {
        ok: false,
        post: null,
      };
    }
    const previousPostRaw = await models.Post.findOne({
      where: { id: args.data.id },
    });

    if (!previousPostRaw) {
      return {
        ok: false,
        post: null,
      };
    }

    const currentTime = getDateTime(new Date().getTime());

    const dataToUpdate: any = {
      publishedAt: currentTime,
      updatedAt: currentTime,
    };
    if (args.data.slug) {
      dataToUpdate.slug = args.data.slug
        .replace("/post/", "")
        .replace("/page/", "");
    }

    const previousPost = previousPostRaw.toJSON() as PostAttributes;

    // slug and title
    if (dataToUpdate.slug) {
      if (dataToUpdate.slug.length === 0) {
        const title = args.data.title || previousPost.title;
        dataToUpdate.slug = await slugify(models.Post, title);
        logger.debug("Slug changed to :", args.data.slug);
      }
    } else if (
      args.data.title &&
      isFirstTitleCreation(previousPost.title, args.data.title)
    ) {
      dataToUpdate.slug = await slugify(models.Post, args.data.title);
      dataToUpdate.title = args.data.title || previousPost.title;
      logger.debug("Slug created:", args.data.slug);
    } else if (args.data.title) {
      dataToUpdate.title = args.data.title;
    }

    // date and status
    if (isPublishingLive(previousPost.status, args.data.status)) {
      dataToUpdate.publishedAt = currentTime;
      logger.debug(
        "Post status changed from draft to published - ",
        currentTime,
      );
      dataToUpdate.scheduledAt = null;
    }

    // cover image
    if (args.data.cover_image) {
      const { width, height } = args.data.cover_image;
      let src = args.data.cover_image.src.replace(host, "");
      dataToUpdate.cover_image = src;
      if (!width && !height) {
        if (src.startsWith("/")) {
          // this is internal image
          src = host + src;
        }
        try {
          const imageSize = await getImageDimensions(src);
          dataToUpdate.cover_image_width = imageSize.width;
          dataToUpdate.cover_image_height = imageSize.height;
        } catch (e) {
          logger.error(
            `No width/height specified for cover image.
            \n Trying to get dimentions of image src`,
            src,
          );
        }
      } else {
        dataToUpdate.cover_image_width = width as number;
        dataToUpdate.cover_image_height = height as number;
      }
      logger.debug(
        "Updating cover image",
        dataToUpdate.cover_image,
        dataToUpdate.cover_image_width,
        dataToUpdate.cover_image_height,
      );
    }

    // reading time
    if (args.data.md && args.data.md !== previousPost.md) {
      // update reading time
      dataToUpdate.reading_time = reading_time(args.data.md).text;
      logger.debug("Reading time: ", dataToUpdate.reading_time);
    }

    if (args.data.status) {
      dataToUpdate.status = args.data.status;
    }
    // update content
    if (savingDraft(previousPost.status, args.data.status)) {
      dataToUpdate.md_draft = args.data.md;
    } else if (args.data.md && args.data.html) {
      dataToUpdate.md = args.data.md;
      try {
        dataToUpdate.html = await setImageWidthAndHeightInHtml(args.data.html);
      } catch (error) {
        logger.error(error);
      }

      // just republished
      if (rePublished(previousPost.status, args.data.status)) {
        dataToUpdate.md_draft = "";
      }
    } else if (rePublished(previousPost.status, args.data.status)) {
      if (previousPost.md_draft) {
        dataToUpdate.md = previousPost.md_draft;
        try {
          dataToUpdate.html = await setImageWidthAndHeightInHtml(
            mdToHtml(previousPost.md_draft),
          );
        } catch (error) {
          logger.error(error);
        }
      }
      dataToUpdate.md_draft = "";
    }

    if (args.data.excerpt) {
      dataToUpdate.excerpt = args.data.excerpt;
    }

    if (args.data.featured) {
      dataToUpdate.featured = args.data.featured;
    }

    await updateMenuOnTitleChange(
      previousPostRaw.type,
      dataToUpdate.title,
      dataToUpdate.slug,
    );

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
            taxItem = await models.Tags.findOne({
              where: { id: tags.id },
            });
            if (taxItem) {
              await previousPostRaw.addTag(taxItem);
            }
            logger.debug(`Added existing tags (${tags.name}) with id`, tags.id);
          } else {
            // Tags needs to be created
            await models.Tags.findOrCreate({
              where: {
                name: tags.name,
                slug: tags.name.toLowerCase(),
              },
            });
            logger.debug(`Added new tags (${tags.name})`);
            taxItem = await models.Tags.findOne({
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

    await models.Post.update(dataToUpdate, {
      where: { id: args.data.id },
    });

    const post = await models.Post.findOne({
      where: { id: args.data.id },
    });
    if (!post) {
      return {
        ok: false,
        post: null,
      };
    }
    return {
      ok: true,
      post: post.get(),
    };
  },
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

async function updateMenuOnTitleChange(
  postType?: PostTypes,
  title?: string,
  slug?: string,
) {
  if (!title && !slug) return false;
  const menu = await models.Setting.findOne({
    where: { option: "menu" },
    raw: true,
  });
  if (!menu) return false;
  const parsedMenu = JSON.parse(menu.value);
  const isPage = postType === PostTypes.Page;

  const updatedMenu = parsedMenu.map(item => {
    if (title) {
      if (isPage && item.type === "page") {
        item.original_name = title;
      }
    }
    if (slug) {
      if (isPage && item.type === "page") {
        item.slug = slug;
      }
    }
    return item;
  });

  await models.Setting.update(
    { value: JSON.stringify(updatedMenu) },
    { where: { option: "menu" } },
  );
}

export default { Mutation };
