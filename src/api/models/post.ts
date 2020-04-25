import "isomorphic-fetch";

import { DataTypes, Model } from "sequelize";

import config from "../../config";
import { getDateTime } from "./../../shared/date";
import slugify from "../../shared/slugify";
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
        md_draft: {
          type: DataTypes.TEXT,
          defaultValue: "",
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
        featured: {
          type: DataTypes.BOOLEAN,
          defaultValue: false,
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
        scheduledAt: {
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
