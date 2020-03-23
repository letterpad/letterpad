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
    }),
  };
};

export const updateTitleAndSlugAndFeatured = async (root, args, { models }) => {
  let { previousPost, title, slug, featured } = args;
  if (typeof featured === "boolean") {
    args.dataToUpdate.featured = featured;
  }
  if (title) {
    args.dataToUpdate.title = title;
  }
  if (slug) {
    args.dataToUpdate.slug = slug;
    logger.debug("Slug changed to :", args.dataToUpdate.slug);
  } else if (!title) {
    return args;
  } else if (isFirstTitleCreation(previousPost.dataValues.title, title)) {
    args.dataToUpdate.slug = await slugify(
      models.Post,
      previousPost.dataValues.title,
    );
    logger.debug("Slug created:", args.dataToUpdate.slug);
  }

  return args;
};

export const updateDatesAndStatus = async (root, args) => {
  let { previousPost, status, publishedAt } = args;
  const currentTime = getDateTime(new Date().getTime());
  if (publishedAt) {
    args.dataToUpdate.publishedAt = publishedAt;
  } else {
    // If this post is being published for the first time, update the publish date
    if (status === "publish" && previousPost.dataValues.status === "draft") {
      args.dataToUpdate.publishedAt = currentTime;
      logger.debug("Post status changed from draft to publish - ", currentTime);
    }
    if (status) {
      args.dataToUpdate.status = status;
    }
  }
  args.dataToUpdate.updatedAt = currentTime;
  return args;
};

export const updateCoverImage = async (root, args) => {
  let { cover_image } = args;
  if (!cover_image) return args;

  args.dataToUpdate.cover_image = cover_image.src.replace(host, "");

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
  logger.debug(
    "Updating cover image",
    args.dataToUpdate.src,
    args.dataToUpdate.cover_image_width,
    args.dataToUpdate.cover_image_height,
  );
  return args;
};

export const updateReadingTime = async (root, args) => {
  let { previousPost, md } = args;
  if (!md) return args;

  if (md !== previousPost.dataValues.md) {
    // update reading time
    args.dataToUpdate.reading_time = reading_time(md).text;
    logger.debug("Reading time: ", args.dataToUpdate.reading_time);
  }
  return args;
};

export const updateContent = async (root, args) => {
  let { html, md, excerpt } = args;
  if (md) {
    args.dataToUpdate.md = md;
  }
  if (excerpt) {
    args.dataToUpdate.excerpt = excerpt;
  }
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
  const newPost = await models.Post.findOne({
    where: { id },
  });
  return {
    ok: true,
    post: newPost,
    errors: [],
  };
};

export const updateTaxonomies = async (root, args, { models }) => {
  let { tags, categories, previousPost } = args;
  if (!tags && !categories) return args;
  logger.debug("Updating taxonomies");
  const prevTaxonomies = await previousPost.getTaxonomies();
  if (!tags)
    tags = [...prevTaxonomies.filter(item => item.type === "post_tag")];
  if (!categories)
    categories = [
      ...prevTaxonomies.filter(item => item.type === "post_category"),
    ];

  tags = tags.map(tag => {
    tag.type = "post_tag";
    return tag;
  });
  categories = categories.map(category => {
    category.type = "post_category";
    return category;
  });
  const taxonomies = [...tags, ...categories];
  if (taxonomies && taxonomies.length > 0) {
    logger.debug("Removing all taxonomies");
    // remove the texonomy relation
    await previousPost.setTaxonomies([]);
    await Promise.all(
      taxonomies.map(async taxonomy => {
        let taxItem = null;
        // add relation with existing taxonomies
        if (taxonomy.id !== 0) {
          taxItem = await models.Taxonomy.findOne({
            where: { id: taxonomy.id },
          });
          const result = await previousPost.addTaxonomy(taxItem);
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
        return await previousPost.addTaxonomy(taxItem);
      }),
    );
  }
  return args;
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
