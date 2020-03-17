import {
  getImageDimensions,
  setImageWidthAndHeightInHtml,
} from "../../utils/imageHelpers";

import config from "../../../config";
import { getDateTime } from "../../../shared/date";
import logger from "../../../shared/logger";
import reading_time from "reading-time";
import slugify from "../../../shared/slugify";

const host = config.ROOT_URL + config.BASE_NAME;

export const addUpdateDataPlaceholder = async (root, args, { models }) => {
  if (args.data.slug) {
    args.data.slug = args.data.slug.replace("/post/", "").replace("/page/", "");
  }
  return {
    ...args.data,
    dataToUpdate: {},
    previousPost: await models.Post.findOne({
      where: { id: args.data.id },
      raw: true,
    }),
  };
};

export const updateTitleAndSlug = async (root, args, { models }) => {
  let { previousPost, title } = args;
  if (!title) return args;
  if (isFirstTitleCreation(previousPost.title, title)) {
    args.dataToUpdate.slug = await slugify(models.Post, previousPost.title);
    logger.debug("Slug created:", args.dataToUpdate.slug);
  }
  return args;
};

export const updateDates = async (root, args) => {
  let { previousPost, status } = args;
  const currentTime = getDateTime(new Date().getTime());
  // If this post is being published for the first time, update the publish date
  if (status == "publish" && previousPost.status == "draft") {
    args.dataToUpdate.publishedAt = currentTime;
    logger.debug("Post status changed from draft to publish - ", currentTime);
  }
  args.dataToUpdate.updatedAt = currentTime;
  return args;
};

export const updateCoverImage = async (root, args) => {
  let { cover_image } = args;
  if (!cover_image) return args;

  args.dataToUpdate.src = cover_image.src.replace(host, "");

  if (!hasDimentions(cover_image)) {
    let { src } = cover_image;
    if (src.startsWith("/")) {
      // this is internal image
      src = host + src;
    }
    try {
      const imageSize = await getImageDimensions(src);
      args.dataToUpdate.cover_image_width = imageSize.width;
      args.dataToUpdate.cover_image_height = imageSize.height;
    } catch (e) {
      logger.error(
        `No width/height specified for cover image.
            \n Trying to get dimentions of image src`,
        src,
      );
    }
  } else {
    args.dataToUpdate.cover_image_width = cover_image.width;
    args.dataToUpdate.cover_image_height = cover_image.height;
  }

  return args;
};

export const updateReadingTime = async (root, args) => {
  let { previousPost, md } = args;
  if (!md) return args;

  if (md !== previousPost.md) {
    // update reading time
    args.dataToUpdate.reading_time = reading_time(md).text;
    logger.debug("Reading time: ", args.dataToUpdate.reading_time);
  }
  return args;
};

export const updateImageDimentionsInHtml = async (root, args) => {
  let { html } = args;
  if (!html) return args;

  try {
    args.dataToUpdate.html = await setImageWidthAndHeightInHtml(html);
  } catch (e) {
    logger.error(e);
  }
  return args;
};

export const executeUpdatePost = async (root, args, { models }) => {
  const { dataToUpdate, id } = args;
  await models.Post.update(dataToUpdate, {
    where: { id },
  });
  return args;
};

export const updateTaxonomies = async (root, args, { models }) => {
  let { id, taxonomies } = args;

  const newPost = await models.Post.findOne({
    where: { id },
  });

  if (taxonomies && taxonomies.length > 0) {
    logger.debug("Removing all taxonomies");
    // remove the texonomy relation
    await newPost.setTaxonomies([]);
    await Promise.all(
      taxonomies.map(async taxonomy => {
        let taxItem = null;
        // add relation with existing taxonomies
        if (taxonomy.id !== 0) {
          taxItem = await models.Taxonomy.findOne({
            where: { id: taxonomy.id },
          });
          const result = await newPost.addTaxonomy(taxItem);
          logger.debug(
            `Added existing taxonomy (${taxonomy.name}) with id`,
            taxonomy.id,
          );
          return result;
        }
        // taxonomies needs to be created
        taxItem = await models.Taxonomy.findOrCreate({
          where: {
            name: taxonomy.name,
            type: taxonomy.type,
            slug: taxonomy.name.toLowerCase(),
          },
        });
        logger.debug(`Added new taxonomy (${taxonomy.name})`);
        taxItem = await models.Taxonomy.findOne({
          where: {
            name: taxonomy.name,
            type: taxonomy.type,
          },
        });
        logger.debug("Linking taxonomy to post", taxonomy.name);
        // add relation
        return await newPost.addTaxonomy(taxItem);
      }),
    );
  }
  return {
    ok: true,
    post: newPost,
    errors: [],
  };
};

function isFirstTitleCreation(prevTitle, newTitle) {
  if (prevTitle === "" && newTitle !== "") {
    return true;
  }
}

function hasDimentions(cover_image) {
  const { width, height } = cover_image;
  if (width && height) return true;
  return false;
}
