import {
  MutationResolvers,
  PostStatusOptions,
  PostTypes,
} from "@/__generated__/__types__";
import { Post } from "@/graphql/db/models/definations/post";
import reading_time from "reading-time";
import {
  slugify,
  getImageDimensions,
  setImageWidthAndHeightInHtml,
  toSlug,
} from "./helpers";
import logger from "@/shared/logger";
import { getDateTime } from "@/shared/utils";
import { EmailTemplates } from "@/graphql/types";
import { ResolverContext } from "../context";
import { ModelsType } from "../db/models/models";

export const slugOfUntitledPost = "untitled";

const Mutation: MutationResolvers<ResolverContext> = {
  async createPost(_parent, args, { session, models }) {
    if (!args.data || !session?.user.id) {
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

    if (!args.data.slug) {
      const slug = args.data.title
        ? toSlug(args.data.title)
        : slugOfUntitledPost;
      args.data.slug = await slugify(models.Post, slug);
    }

    if (args.data.cover_image) {
      //@ts-ignore
      args.data.cover_image = args.data.cover_image.src;
      if (args.data.cover_image?.width) {
        //@ts-ignore
        args.data.cover_image_width = args.data.cover_image.width;
      }
      if (args.data.cover_image?.height) {
        //@ts-ignore
        args.data.cover_image_height = args.data.cover_image.height;
      }
    }

    if (!args.data.html) {
      args.data.html = "";
      args.data.html = "";
    }

    const newPost = await author?.$create("post", args.data as any);

    if (newPost) {
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

  async updatePost(_parent, args, { session, models, mailUtils }, _info) {
    if (!session?.user.id) {
      return {
        __typename: "PostError",
        message: "Authentication failed",
      };
    }
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

      const currentTime = getDateTime(new Date());

      const dataToUpdate: any = {
        updatedAt: currentTime,
      };
      if (args.data.slug) {
        dataToUpdate.slug = args.data.slug
          .replace("/post/", "")
          .replace("/page/", "");
      }

      const previousPost = previousPostRaw.get() as Post;

      // slug and title
      if (dataToUpdate.slug) {
        dataToUpdate.slug = await slugify(models.Post, dataToUpdate.slug);
        logger.debug("Slug changed to :", args.data.slug);
      } else if (
        args.data.title &&
        isFirstTitleCreation(previousPost.title, args.data.title)
      ) {
        dataToUpdate.slug = await slugify(models.Post, args.data.title);
        dataToUpdate.title = args.data.title || previousPost.title;
        logger.debug("Slug created:", dataToUpdate.slug);
      }
      if (args.data.title) {
        dataToUpdate.title = args.data.title;
      }

      // date and status
      if (isPublishingLive(previousPost.status, args.data.status)) {
        if (!previousPostRaw.publishedAt) {
          dataToUpdate.publishedAt = currentTime;
        }
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
      if (args.data.html && args.data.html !== previousPost.html) {
        // update reading time
        dataToUpdate.reading_time = reading_time(args.data.html).text;
        logger.debug("Reading time: ", dataToUpdate.reading_time);
      }

      if (args.data.status) {
        dataToUpdate.status = args.data.status;
      }
      // update content
      if (savingDraft(previousPost.status, args.data.status)) {
        dataToUpdate.html_draft = args.data.html;
        logger.debug("This is draft content...");
      } else if (args.data.html) {
        dataToUpdate.html = args.data.html;
        try {
          dataToUpdate.html = await setImageWidthAndHeightInHtml(
            args.data.html,
          );
        } catch (error) {
          logger.error(error);
        }
        logger.debug("This is live content");
        // just republished
        if (rePublished(previousPost.status, args.data.status)) {
          logger.debug("Republishing. Cleaning draft...");
          dataToUpdate.html_draft = "";
        }
      } else if (rePublished(previousPost.status, args.data.status)) {
        if (previousPost.html_draft) {
          dataToUpdate.html = previousPost.html_draft;
          try {
            dataToUpdate.html = await setImageWidthAndHeightInHtml(
              previousPost.html_draft,
            );
          } catch (error) {
            logger.error(error);
          }
        }
        dataToUpdate.html_draft = "";
      }

      if (args.data.excerpt) {
        dataToUpdate.excerpt = args.data.excerpt;
      }

      if (args.data.featured) {
        dataToUpdate.featured = args.data.featured;
      }

      await updateMenuOnTitleChange(
        models.Author,
        session.user.id,
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
          await previousPostRaw.$set("tags", []);

          for (const tag of tags) {
            logger.info("processing tag", tag);
            // add relation with existing Tags
            if (tag.id > 0) {
              const tagFound = await models.Tag.findOne({
                where: { id: tag.id },
              });
              if (tagFound) {
                await previousPostRaw.$add("tag", tagFound);
              }
              logger.debug(`Added existing tags (${tag.name}) with id`, tag.id);
            } else {
              const author = await previousPostRaw.$get("author");
              const tagsFound = await author?.$get("tags", {
                where: { name: tag.name },
              });
              if (tagsFound?.length === 0) {
                const newTag = await author?.$create("tag", {
                  name: tag.name,
                  slug: tag.name.toLowerCase(),
                });
                if (newTag) {
                  logger.debug(`Created new tag (${tag.name})`);
                  await previousPostRaw.$add("tag", newTag);
                  logger.debug("Linked tags to post", tag.name);
                }
              } else if (tagsFound) {
                await previousPostRaw.$add("tag", tagsFound[0]);
                logger.debug("Linked tags to post", tag.name);
              }
            }
          }
        }
      }

      await models.Post.update(dataToUpdate, {
        where: { id: args.data.id },
      });
      if (dataToUpdate.status === PostStatusOptions.Published) {
        await mailUtils.enqueueEmail({
          template_id: EmailTemplates.NEW_POST,
          post_id: args.data.id,
        });
      }
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
  statusArg?: PostStatusOptions,
) {
  if (statusArg === PostStatusOptions.Draft) return true;
  if (prevStatus === PostStatusOptions.Draft && !statusArg) return true;
  if (prevStatus === PostStatusOptions.Published && !statusArg) return true;

  return false;
}

async function updateMenuOnTitleChange(
  Author: ModelsType["Author"],
  authorId: number,
  postType?: PostTypes,
  title?: string,
  slug?: string,
) {
  if (!title && !slug) return false;
  const author = await Author.findOne({ where: { id: authorId } });
  if (!author) return false;
  const setting = await author.$get("setting");

  const isPage = postType === PostTypes.Page;

  const updatedMenu = setting?.menu.map((item) => {
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
  //@ts-ignore
  setting?.setDataValue("menu", updatedMenu);
  //@ts-ignore
  await author.$set("setting", setting);
}

export default { Mutation };
