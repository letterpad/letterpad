import { _createPost, _updatePost } from "../models/post";
import {
  checkDisplayAccess,
  createPostsPerm,
  editPostPerm,
} from "../utils/permissions";

import Fuse from "fuse.js";
import Sequelize from "sequelize";
import config from "../../config";
import { innertext } from "../utils/common";
import logger from "../../shared/logger";
import memoryCache from "../utils/memoryCache";

const host = config.ROOT_URL + config.BASE_NAME;

const noResult = {
  count: 0,
  rows: [],
};

const postresolver = {
  Query: {
    /**
     * Query to take care of multiple post in one page.
     * Used for Search and Admin posts and pages list.
     */
    posts: checkDisplayAccess.createResolver(
      async (root, args, { models, user }) => {
        logger.debug("Reached resolver: posts");
        const conditions = { include: [], where: {}, limit: 20 };

        const {
          status,
          sortBy,
          author,
          tag,
          category,
          tagSlug,
          categorySlug,
          limit,
          query,
          cursor,
          type = "post",
          page,
        } = args.filters;
        if (category) {
          const taxCategory = await models.Taxonomy.findOne({
            where: Sequelize.where(
              Sequelize.fn("lower", Sequelize.col("name")),
              Sequelize.fn("lower", category),
            ),
          });
          if (!taxCategory) return noResult;
          conditions.include.push({
            model: models.PostTaxonomy,
            where: { taxonomy_id: taxCategory.id },
            require: true,
          });
        }

        if (categorySlug) {
          let realCategorySlug = categorySlug;
          if (categorySlug === "/") {
            // get the first menu item.
            const menuStr = await models.Setting.findOne({
              where: { option: "menu" },
            });
            const parsedMenu = JSON.parse(menuStr.dataValues.value);

            if (parsedMenu.length > 0) {
              realCategorySlug = parsedMenu[0].slug;
            }
          }
          const taxCategory = await models.Taxonomy.findOne({
            where: { slug: realCategorySlug, type: "post_category" },
          });

          if (!taxCategory) return noResult;

          conditions.include.push({
            model: models.PostTaxonomy,
            where: { taxonomy_id: taxCategory.id },
            require: true,
          });
        }

        if (tag) {
          const taxTag = await models.Taxonomy.findOne({
            where: Sequelize.where(
              Sequelize.fn("lower", Sequelize.col("name")),
              Sequelize.fn("lower", tag),
            ),
          });
          if (!taxTag) return noResult;

          conditions.include.push({
            model: models.PostTaxonomy,
            where: { taxonomy_id: taxTag.id },
            require: true,
          });
        }

        if (tagSlug) {
          const taxTag = await models.Taxonomy.findOne({
            where: { slug: tagSlug, type: "post_tag" },
          });
          if (!taxTag) return noResult;
          conditions.include.push({
            model: models.PostTaxonomy,
            where: { taxonomy_id: taxTag.id },
            require: true,
          });
        }

        if (author) {
          const authorCondition = {
            where: {
              fname: { [Sequelize.Op.like]: "%" + author + "%" },
            },
          };
          const author = await models.Author.findOne(authorCondition);

          if (!author) {
            return noResult;
          }
          conditions.include.push({
            model: models.Author,
            where: { id: author.id },
            require: true,
          });
        }

        if (type) {
          conditions.where.type = type;
        }

        if (status) {
          conditions.where.status = status;
        } else {
          conditions.where.status = { [Sequelize.Op.ne]: "trash" };
        }

        conditions.order = [["updatedAt", "DESC"]];
        if (sortBy) {
          conditions.order = [
            ["publishedAt", sortBy === "oldest" ? "ASC" : "DESC"],
          ];
          // for public users, sort it based on published date
          if (user && user.id) {
            conditions.order = [["publishedAt", "DESC"]];
          }
        }

        if (limit) {
          conditions.limit = limit;
        }

        if (query) {
          conditions.where.title = {
            [Sequelize.Op.like]: "%" + query + "%",
          };
        }
        if (cursor) {
          conditions.where.id = { [Sequelize.Op.gt]: cursor };
        } else if (page) {
          conditions.offset = (page - 1) * conditions.limit;
        }
        // conditions.raw = true;
        const result = await models.Post.findAndCountAll(conditions);
        result.rows = result.rows.map(item => {
          item.dataValues = normalizePost(item.dataValues);
          return item;
        });
        return {
          count: result.count,
          rows: result.rows,
        };
      },
    ),

    search: async (root, args, { models, user }) => {
      logger.debug("Reached resolver: search");
      let cachedData = memoryCache.get("posts");
      if (!cachedData) {
        const data = await models.Post.findAll({
          attributes: ["id", "title", "html", "excerpt", "publishedAt", "slug"],
          where: { status: "publish" },
        });

        const cleanedData = data.map(item => {
          let cleanItem = item.toJSON();
          cleanItem.html = innertext(cleanItem.html);
          return cleanItem;
        });
        memoryCache.set("posts", cleanedData);
        cachedData = cleanedData;
      }

      const options = {
        keys: [
          {
            name: "title",
            weight: 1,
          },
          {
            name: "excerpt",
            weight: 0.9,
          },
          {
            name: "html",
            weight: 0.8,
          },
        ],
        includeMatches: true,
      };

      const fuse = new Fuse(cachedData, options);
      const searchResult = fuse.search(args.query).map(data => {
        delete data.item.html;
        return data.item;
      });
      return {
        ok: true,
        rows: searchResult.slice(0, 6),
        count: 6,
      };
    },
    /**
     * Query to handle a single post/page.
     */
    post: checkDisplayAccess.createResolver(async (root, args, { models }) => {
      logger.debug("Reached resolver: post");
      const conditions = { where: { ...args.filters } };
      if (args.filters.id) {
        conditions.where.id = args.filters.id;
      }
      if (args.filters.slug) {
        conditions.where.slug = args.filters.slug;
      }
      let post = await models.Post.findOne(conditions);
      if (post) {
        post.dataValues = normalizePost(post.dataValues);
      }
      return post;
    }),
    /**
     * Query to take care of adjacent posts.
     */
    adjacentPosts: async (root, args, { models }) => {
      let result = {};
      args.status = "publish";
      args.type = "post";
      // get the current post
      const currentPost = await models.Post.findOne({ where: args });
      if (currentPost === null) {
        throw new Error("Invalid query");
      }

      // we dont need the slug anymore. Clone and remove it.
      const { slug, ...newArgs } = args;

      // get the preview item
      result.previous = await models.Post.findOne({
        where: {
          ...newArgs,
          id: { [Sequelize.Op.lt]: currentPost.id },
        },
        order: [["id", "DESC"]],
      });

      result.previous = normalizePost(result.previous);

      // get the next item
      result.next = await models.Post.findOne({
        where: {
          ...newArgs,
          id: {
            [Sequelize.Op.gt]: currentPost.dataValues.id,
          },
        },
        order: [["id", "ASC"]],
      });
      result.next = normalizePost(result.next);
      return result;
    },
    /**
     * Query to get some stats for the admin dashboard
     * TODO: Make one query to process all the data
     */
    stats: async (root, args, { models }) => {
      logger.debug("Reached resolver: stats");
      const result = {
        posts: { published: 0, drafts: 0 },
        pages: { published: 0, drafts: 0 },
        tags: 0,
        categories: 0,
      };
      result.posts.published = await models.Post.count({
        where: { status: "publish", type: "post" },
      });

      result.posts.drafts = await models.Post.count({
        where: { status: "draft", type: "post" },
      });

      result.pages.published = await models.Post.count({
        where: { status: "publish", type: "page" },
      });

      result.pages.drafts = await models.Post.count({
        where: { status: "draft", type: "page" },
      });

      result.categories = await models.Taxonomy.count({
        where: { type: "post_category" },
      });
      result.tags = await models.Taxonomy.count({
        where: { type: "post_tag" },
      });

      return result;
    },
  },
  Mutation: {
    createPost: createPostsPerm.createResolver(
      async (root, args, { models, user }) => {
        args.data.authorId = user.id;
        memoryCache.del("posts");
        const result = await _createPost(args.data, models);
        result.post.dataValues = normalizePost(result.post.dataValues);
        return result;
      },
    ),
    updatePost: editPostPerm.createResolver(async (root, args, { models }) => {
      memoryCache.del("posts");
      if (args.data.slug) {
        args.data.slug = args.data.slug
          .replace("/post/", "")
          .replace("/page/", "");
      }
      if (args.data.cover_image) {
        args.data.cover_image.src = args.data.cover_image.src.replace(host, "");
      }
      const data = await _updatePost(args.data, models);
      data.post.dataValues = normalizePost(data.post.dataValues);

      return data;
    }),
    uploadFile: editPostPerm.createResolver((root, args, { models }) => {
      return _updatePost(args, models);
    }),
    deletePosts: editPostPerm.createResolver(async (root, args, { models }) => {
      try {
        const deleteFromSystem = args.deleteFromSystem || false;
        if (deleteFromSystem) {
          await models.Post.destroy({
            where: { id: args.ids },
          });
        } else {
          await models.Post.update(
            { status: "trash" },
            {
              where: {
                id: args.ids,
              },
            },
          );
          memoryCache.del("posts");
        }
        return {
          ok: true,
        };
      } catch (e) {
        return {
          ok: false,
          errors: [
            {
              message: e.message,
              path: "deleteMessage",
            },
          ],
        };
      }
    }),
  },
  Post: {
    author: async post => {
      const author = await post.getAuthor();
      author.avatar = host + author.avatar;
      return author;
    },
    taxonomies: async post => {
      const taxonomies = await post.getTaxonomies();
      return taxonomies.map(item => {
        const type = item.type === "post_category" ? "category" : "tag";
        item.slug = "/" + type + "/" + item.slug;
        return item;
      });
    },
  },
};

export default postresolver;

function normalizePost(post) {
  let {
    cover_image_width,
    cover_image_height,
    cover_image,
    slug,
    ...rest
  } = post;
  if (cover_image && !cover_image.startsWith("http")) {
    cover_image = host + "/" + cover_image;
  }

  // normalize cover image
  post = {
    ...rest,
    cover_image: {
      src: cover_image || "",
      width: cover_image_width || 0,
      height: cover_image_height || 0,
    },
    slug: "/" + rest.type + "/" + slug,
  };

  return post;
}
