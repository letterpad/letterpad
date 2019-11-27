import { parseErrors } from "../../shared/util";
import slugify from "../../shared/slugify";
import config from "../../config";
import moment from "moment";
import { updateMenuItem } from "../resolvers/setting";

export default (conn, DataTypes) => {
  const Post = conn.define(
    "post",
    {
      title: {
        type: DataTypes.STRING,
        defaultValue: config.defaultTitle,
      },
      mode: {
        type: DataTypes.STRING,
        defaultValue: "rich-text",
      },
      body: {
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
      freezeTableName: true, // Model tableName will be the same as the model name
    },
  );
  Post.associate = models => {
    //  n:m
    Post.belongsToMany(models.Taxonomy, {
      through: "PostTaxonomy",
      as: "taxonomies",
    });
    Post.hasMany(models.PostTaxonomy);
    //  1:m
    Post.belongsTo(models.Author, { foreignKey: "authorId" });
  };
  return Post;
};

export async function _createPost(data, models) {
  try {
    //  create a slug for the new psot
    data.slug = await slugify(models.Post, config.defaultSlug);
    if (!data.body) {
      data.body = "";
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
    const errors = parseErrors(e);
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

    // Initially the title will be empty for newly created post.
    // While updating check if the user has entered a new title and based on that create a new slug.
    // If the user changes the title the second time then dont change the slug again.
    // Doing so will affect SEO.
    let slug = null;
    if (oldPost.title === "" && updatedPost.title !== oldPost.title) {
      //  create the slug
      slug = await slugify(models.Post, updatedPost.title);
      updatedPost = { ...updatedPost, slug };
    }
    if (updatedPost.slug || (oldPost.type === "page" && slug)) {
      const options = { slug: updatedPost.slug };
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
    }
    updatedPost = { ...updatedPost, updatedAt: currentTime };
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
            return await newPost.addTaxonomy(taxItem);
          }
          // taxonomies needs to be created
          taxItem = await models.Taxonomy.findOrCreate({
            where: {
              name: taxonomy.name,
              type: taxonomy.type,
            },
          });

          taxItem = await models.Taxonomy.findOne({
            where: {
              name: taxonomy.name,
              type: taxonomy.type,
            },
          });

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
      errors: parseErrors(e),
    };
  }
}
