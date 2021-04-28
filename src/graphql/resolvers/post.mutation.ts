import { Tags } from "../db/models/tags";
import {
  PostStatusOptions,
  PostTypes,
} from "@/__generated__/type-defs.graphqls";
import { PostAttributes } from "../db/models/post";
import { ResolverContext } from "../apollo";
import reading_time from "reading-time";
import { mdToHtml } from "letterpad-editor";
import { MutationResolvers } from "@/__generated__/type-defs.graphqls";

import {
  slugify,
  getDateTime,
  getImageDimensions,
  setImageWidthAndHeightInHtml,
} from "./helpers";
import logger from "../../../shared/logger";
import models from "../db/models";

const Mutation: MutationResolvers<ResolverContext> = {
  async createPost(_parent, args, { session }, _info) {
    if (!args.data || !session?.user) {
      return {
        __typename: "PostError",
        message: "Session not found",
      };
    }
    const author = await models.Author.findOne({
      where: { id: session.user.id },
    });

    if (!author) {
      return {
        __typename: "PostError",
        message: "Author not found",
      };
    }
    args.data.slug = await slugify(models.Post, "untitled");
    if (!args.data.md) {
      args.data.md = "";
      args.data.html = "";
    }
    // add an empty string for title
    if (!args.data.title) {
      args.data.title = "";
    }
    const newPost = await author?.createPost(args.data as any);

    if (newPost) {
      const defaultTags = await models.Tags.findOne({
        where: { id: newPost.id },
      });
      if (defaultTags) await newPost.addTag(defaultTags);

      return {
        __typename: "Post",
        ...newPost.get(),
      };
    }
    return {
      __typename: "PostError",
      message: "Unable to create post",
    };
  },

  async updatePost(_parent, args, _context, _info) {
    try {
      if (!args.data) {
        return {
          __typename: "PostError",
          message: "No arguments to create a post",
        };
      }
      const previousPostRaw = await models.Post.findOne({
        where: { id: args.data.id },
      });

      if (!previousPostRaw) {
        return {
          __typename: "PostError",
          message: "Current post not found to update",
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

      const previousPost = previousPostRaw.get() as PostAttributes;

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
        let src = args.data.cover_image.src.replace(
          process.env.ROOT_URL || "",
          "",
        );
        dataToUpdate.cover_image = src;
        if (!width && !height) {
          if (src.startsWith("/")) {
            // this is internal image
            src = new URL(src, process.env.ROOT_URL).href;
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
          dataToUpdate.html = await setImageWidthAndHeightInHtml(
            args.data.html,
          );
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

        const tags = [...args.data.tags];

        if (tags && tags.length > 0) {
          logger.debug("Removing all Tags");
          // remove the tags relation
          await previousPostRaw.setTags([]);

          for (let i = 0; i < tags.length; i++) {
            const tag = tags[i];

            logger.info("processing tag", tag);
            // add relation with existing Tags
            if (tag.id > 0) {
              const tagFound = await models.Tags.findOne({
                where: { id: tag.id },
              });
              if (tagFound) {
                await previousPostRaw.addTag(tagFound);
              }
              logger.debug(`Added existing tags (${tag.name}) with id`, tag.id);
            } else {
              const author = await previousPostRaw.getAuthor();
              const tagsFound = await author.getTags({
                where: { name: tag.name },
              });
              if (tagsFound.length === 0) {
                const newTag = await author.createTag({
                  name: tag.name,
                  slug: tag.name.toLowerCase(),
                });
                if (newTag) {
                  logger.debug(`Created new tag (${tag.name})`);
                  await previousPostRaw.addTag(newTag);
                  logger.debug("Linked tags to post", tag.name);
                }
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
          __typename: "PostError",
          message: "Updated post not found",
        };
      }
      return {
        __typename: "Post",
        ...post.get(),
      };
    } catch (e) {
      console.log(e);
    }
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
    attributes: ["value"],
    where: { option: "menu" },
    raw: true,
  });
  if (!menu?.value) return false;
  if (typeof menu?.value !== "string") return false;

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
