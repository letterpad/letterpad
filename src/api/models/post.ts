import "isomorphic-fetch";

import { DataTypes, Model } from "sequelize";
import {
  getImageDimensions,
  setImageWidthAndHeightInHtml,
} from "../utils/imageHelpers";

import config from "../../config";
import logger from "../../shared/logger";
import moment from "moment";
import reading_time from "reading-time";
import slugify from "../../shared/slugify";
import { updateMenuItem } from "../resolvers/setting";
import utils from "../../shared/util";

const host = config.ROOT_URL + config.BASE_NAME;

class Post extends Model {
  static associate(models) {
    this.belongsToMany(models.Taxonomy, {
      through: "PostTaxonomy",
      as: "taxonomies",
    });
    this.hasMany(models.PostTaxonomy);
    //  1:m
    this.belongsTo(models.Author, { foreignKey: "authorId" });
  }

  static init(sequelize) {
    super.init.call(
      this,
      {
        title: {
          type: DataTypes.STRING,
          defaultValue: config.defaultTitle,
        },
        html: {
          type: DataTypes.TEXT,
        },
        md: {
          type: DataTypes.TEXT,
        },
        excerpt: {
          type: DataTypes.STRING(400),
          defaultValue: "",
        },
        cover_image: {
          type: DataTypes.STRING,
          defaultValue: "",
        },
        cover_image_width: {
          type: DataTypes.INTEGER,
          defaultValue: 0,
        },
        cover_image_height: {
          type: DataTypes.INTEGER,
          defaultValue: 0,
        },
        type: {
          type: DataTypes.STRING,
          defaultValue: "",
        },
        status: {
          type: DataTypes.STRING,
          defaultValue: "draft",
        },
        slug: {
          type: DataTypes.STRING,
          defaultValue: "",
        },
        reading_time: {
          type: DataTypes.STRING,
          defaultValue: "",
        },
        publishedAt: {
          type: DataTypes.DATE,
        },
      },
      {
        sequelize,
        freezeTableName: true,
      },
    );
    return Post;
  }
}

export default Post;

export async function _createPost(data, models) {
  try {
    //  create a slug for the new psot
    data.slug = await slugify(models.Post, config.defaultSlug);
    if (!data.md) {
      data.md = "";
      data.html = "";
    }
    // add an empty string for title
    if (!data.title) {
      data.title = "";
    }
    const newPost = await models.Post.create(data);

    const defaultTaxonomy = await models.Taxonomy.findOne({
      where: { id: 1 },
    });
    await newPost.addTaxonomy(defaultTaxonomy);
    const post = await models.Post.findOne({ where: { id: newPost.id } });

    return {
      ok: true,
      post,
      errors: [],
    };
  } catch (e) {
    const errors = utils.parseErrors(e);
    return {
      ok: false,
      post: {},
      errors,
    };
  }
}

export async function _updatePost(updatedPost, models) {
  try {
    const { id } = updatedPost;
    // first get the post which is being updated
    const oldPost = await models.Post.findOne({
      where: { id },
    });

    logger.debug("Updating post with id:", id);

    // Initially the title will be empty for newly created post.
    // While updating check if the user has entered a new title and based on that create a new slug.
    // If the user changes the title the second time then dont change the slug again.
    // Doing so will affect SEO.
    let slug = null;
    if (oldPost.title === "" && updatedPost.title !== oldPost.title) {
      //  create the slug
      slug = await slugify(models.Post, updatedPost.title);
      updatedPost = { ...updatedPost, slug };
      logger.debug("Slug changed to:", slug);
    }
    if (updatedPost.slug || (oldPost.type === "page" && slug)) {
      const options = { slug: updatedPost.slug, title: oldPost.title };
      if (updatedPost.title) {
        options.title = updatedPost.title;
      }
      // check the menu. the menu has page items. update the slug of the page menu item if it exist.
      await updateMenuItem(models, id, oldPost.type, options);
    }
    const currentTime = moment.utc(new Date()).format("YYYY-MM-DD HH:mm:ss");
    // If this post is being published for the first time, update the publish date
    if (updatedPost.status == "publish" && oldPost.status == "draft") {
      updatedPost = { ...updatedPost, publishedAt: currentTime };
      logger.debug("Post status changed from draft to publish - ", currentTime);
    }
    let coverImageProps = { ...oldPost.cover_image };
    if (updatedPost.cover_image) {
      coverImageProps.cover_image = updatedPost.cover_image.src;
    }

    if (updatedPost.cover_image && updatedPost.cover_image.src) {
      let cover_image_url = updatedPost.cover_image.src;
      if (!updatedPost.cover_image.src.startsWith("http")) {
        // this is internal image, get its width and height
        cover_image_url = host + updatedPost.cover_image.src;
      }
      const imageSize = await getImageDimensions(cover_image_url);
      coverImageProps.cover_image_width = imageSize.width;
      coverImageProps.cover_image_height = imageSize.height;
    }

    if (updatedPost.md && updatedPost.md !== oldPost.md) {
      // update reading time
      updatedPost.reading_time = reading_time(updatedPost.md).text;
      logger.debug("Reading time: ", updatedPost.reading_time);
    }
    updatedPost = {
      ...updatedPost,
      updatedAt: currentTime,
      html: await setImageWidthAndHeightInHtml(updatedPost.html),
      ...coverImageProps,
    };
    await models.Post.update(updatedPost, {
      where: { id },
    });

    // get all values of the updated post
    const newPost = await models.Post.findOne({
      where: { id },
    });

    // the taxonomies like tags/cathegories might have chqnged or added.
    // sync them
    if (updatedPost.taxonomies && updatedPost.taxonomies.length > 0) {
      logger.debug("Removing all taxonomies");
      // remove the texonomy relation
      await newPost.setTaxonomies([]);
      await Promise.all(
        updatedPost.taxonomies.map(async taxonomy => {
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
  } catch (e) {
    console.log(e);
    return {
      ok: false,
      post: {},
      errors: utils.parseErrors(e),
    };
  }
}
