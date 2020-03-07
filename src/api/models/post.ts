import "isomorphic-fetch";

import { DataTypes, Model } from "sequelize";

import cheerio from "cheerio";
import config from "../../config";
import { getCloudinarySettings } from "./../fetchSettings";
import logger from "../../shared/logger";
import moment from "moment";
import slugify from "../../shared/slugify";
import { updateMenuItem } from "../resolvers/setting";
import utils from "../../shared/util";

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
  const cloudinary = await getCloudinarySettings(models.Setting);
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
    updatedPost = {
      ...updatedPost,
      updatedAt: currentTime,
      html: await setResponsiveImages(updatedPost.html),
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

const sizes = [480, 720, 960, 1200, 1440];
const srcSizes = `(max-width: 720px) 100vw, 720px`;

const setResponsiveImages = async (html: string) => {
  const $ = cheerio.load(html);
  const $bodyImages = $("img");

  for (let i = 0; i < $bodyImages.length; i++) {
    const el = $bodyImages[i];
    const $el = $(el);
    $el.attr("loading", "lazy");
    let src = $el.attr("src");
    if (!src.startsWith("http")) return;
    src = src.replace("http://", "https://");
    const url = new URL(src);

    if (url.hostname.includes("unsplash")) {
      const srcSet = sizes.map(w => makeUnsplashImage(src, w)).join(", ");
      $el.attr("src", makeUnsplashUrl(src, sizes[sizes.length - 1]));
      $el.attr("sizes", srcSizes);
      $el.attr("srcset", makeUnsplashUrl(src, 30));
      $el.attr("data-srcset", srcSet);
    } else if (url.hostname.includes("cloudinary")) {
      const originalSrc = $el.attr("src");
      const base64Url = await makeCloudinaryUrlBase64(src, 10);
      const srcSet = sizes
        .map(w => makeCloudinaryImage(originalSrc, w))
        .join(", ");
      console.log(base64Url, srcSet);
      $el.attr("src", makeCloudinaryUrl(src, sizes[sizes.length - 1]));
      $el.attr("sizes", srcSizes);
      $el.attr("data-srcset", srcSet);
      $el.attr("srcset", base64Url);
      $el.attr("style", "width: 100%;max-width: 720px");
    }
  }
  return $.html();
};

function makeUnsplashImage(src, width, extras = "") {
  return `${makeUnsplashUrl(src, width, extras)} ${width}w`;
}

function makeCloudinaryImage(src, width) {
  return `${makeCloudinaryUrl(src, width)} ${width}w`;
}

function makeUnsplashUrl(src, width, extras = "") {
  const url = new URL(src);
  const baseUrl = `${url.protocol}//${url.hostname}${url.pathname}`;
  return `${baseUrl}?w=${width}&auto=format&lossless=true${extras}`;
}

function makeCloudinaryUrl(src, width) {
  const replace = /image\/upload\/(.*)\/blog-images/;
  const url = src.replace(
    replace,
    `image/upload/q_auto,f_auto,w_${width}/v1/blog-images`,
  );

  return url;
}

async function makeCloudinaryUrlBase64(url, width) {
  const requestURL = makeCloudinaryUrl(url, width);
  const response = await fetch(requestURL);
  //@ts-ignore
  const arrayBuffer = await response.buffer();
  const b64 = arrayBuffer.toString("base64");
  return `data:${response.headers.get("content-type")};base64,${b64}`;
}
