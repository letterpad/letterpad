import {
  getImageDimensions,
  setImageWidthAndHeightInHtml,
} from "../../utils/imageHelpers";

import config from "../../../config";
import { getDateTime } from "../../../shared/date";
import logger from "../../../shared/logger";
import { mdToHtml } from "letterpad-editor";
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
    args.dataToUpdate.slug = slug.replace("page/", "").replace("post/", "");
    if (args.dataToUpdate.slug.length === 0) {
      const _title = title || previousPost.dataValues.title;
      args.dataToUpdate.slug = await slugify(models.Post, _title);
    }
    logger.debug("Slug changed to :", args.dataToUpdate.slug);
  } else if (!title) {
    return args;
  } else if (isFirstTitleCreation(previousPost.dataValues.title, title)) {
    args.dataToUpdate.slug = await slugify(
      models.Post,
      args.dataToUpdate.title,
    );
    logger.debug("Slug created:", args.dataToUpdate.slug);
  }

  return args;
};

export const updateDatesAndStatus = async (root, args) => {
  let { previousPost, status, publishedAt, scheduledAt } = args;
  const currentTime = getDateTime(new Date().getTime());
  if (publishedAt) {
    args.dataToUpdate.publishedAt = publishedAt;
  } else if (typeof scheduledAt !== "undefined") {
    args.dataToUpdate.scheduledAt = scheduledAt;
  } else {
    // If this post is being published for the first time, update the publish date
    if (status === "publish" && previousPost.dataValues.status === "draft") {
      args.dataToUpdate.publishedAt = currentTime;
      logger.debug("Post status changed from draft to publish - ", currentTime);

      args.dataToUpdate.scheduledAt = null;
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
  let { html, md, excerpt, previousPost, status } = args;

  if (!status && previousPost.dataValues.status === "publish") {
    args.dataToUpdate.md_draft = md;
  } else if (md && html) {
    args.dataToUpdate.md = md;
    try {
      args.dataToUpdate.html = await setImageWidthAndHeightInHtml(html);
    } catch (error) {
      logger.error(error);
    }

    // just republished
    if (previousPost.dataValues.status === "publish" && status === "publish") {
      args.dataToUpdate.md_draft = "";
    }
  } else {
    // just republished
    if (previousPost.dataValues.status === "publish" && status === "publish") {
      if (previousPost.dataValues.md_draft) {
        args.dataToUpdate.md = previousPost.dataValues.md_draft;
        try {
          args.dataToUpdate.html = await setImageWidthAndHeightInHtml(
            mdToHtml(previousPost.dataValues.md_draft),
          );
        } catch (error) {
          logger.error(error);
        }
      }
      args.dataToUpdate.md_draft = "";
    }
  }

  if (excerpt) {
    args.dataToUpdate.excerpt = excerpt;
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
  let { tags, previousPost } = args;
  if (!tags) return args;
  logger.debug("Updating taxonomies");
  const prevTaxonomies = await previousPost.getTaxonomies();
  if (!tags)
    tags = [...prevTaxonomies.filter(item => item.type === "post_tag")];

  tags = tags.map(tag => {
    tag.type = "post_tag";
    return tag;
  });

  const taxonomies = [...tags];
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

export const updateMenuOnTitleChange = async (root, args, { models }) => {
  const { dataToUpdate, previousPost } = args;
  if (!dataToUpdate.title && !dataToUpdate.slug) return args;
  const menu = await models.Setting.findOne({
    where: { option: "menu" },
    raw: true,
  });

  const parsedMenu = JSON.parse(menu.value);

  const updatedMenu = parsedMenu.map(item => {
    if (dataToUpdate.label) {
      if (previousPost.dataValues.type === "page" && item.type === "page") {
        item.original_name = dataToUpdate.label;
      }
    }
    if (dataToUpdate.slug) {
      if (previousPost.dataValues.type === "page" && item.type === "page") {
        item.slug = dataToUpdate.slug;
      }
    }
    return item;
  });

  await models.Setting.update(
    { value: JSON.stringify(updatedMenu) },
    { where: { option: "menu" } },
  );
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
