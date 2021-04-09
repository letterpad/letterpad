import { Op, Sequelize } from "sequelize";
import {
  MutationResolvers,
  PostStatusOptions,
  PostTypes,
  SortBy,
} from "../../__generated__/lib/type-defs.graphqls";
import { QueryResolvers } from "../type-defs.graphqls";
import { ResolverContext } from "../apollo";
import { decrypt } from "../utils/crypto";
// import { PostTypes } from "../types";

const Query: Required<QueryResolvers<ResolverContext>> = {
  /**
   * Query to take care of multiple post in one page.
   * Used for Search and Admin posts and pages list.
   */
  async posts(_parent, args, _context, _info) {
    // if (!args.filters.type) {
    //   args.filters.type = PostTypes.Post;
    // }
    // the query params can be a type of the post
    const query = {
      ...args.filters,
      conditions: {
        order: [["publishedAt", SortBy.Desc]] as any,
        include: [],
        where: {
          id: null,
          featured: false,
          status: { [Op.ne]: PostStatusOptions.Trash },
          type: "",
        },
        limit: 20,
        offset: 0,
      },
    };

    // resolve menu filter

    if (args.filters.tagSlug) {
      let { tagSlug } = args.filters;
      if (tagSlug === "/") {
        // get the first menu item.
        const { value } = await _context.models.Setting.findOne({
          attributes: ["value"],
          where: { option: "menu" },
          raw: true,
        });
        tagSlug = JSON.parse(value)[0].slug;
      }
      const taxTag = await _context.models.Tags.findOne({
        where: { slug: tagSlug },
      });

      if (taxTag) {
        query.conditions.include.push({
          model: _context.models.PostTags,
          where: { tags_id: taxTag.getDataValue("id") },
          require: true,
        });
      }
    }

    // resolve tag filter

    if (args.filters.tag) {
      const taxTag = await _context.models.Tags.findOne({
        where: Sequelize.where(
          Sequelize.fn("lower", Sequelize.col("name")),
          Sequelize.fn("lower", args.filters.tag),
        ),
      });
      if (taxTag) {
        query.conditions.include.push({
          model: _context.models.PostTags,
          where: { tags_id: taxTag.getDataValue("id") },
          require: true,
        });
      }
    }

    // resolve author
    if (args.filters.author) {
      const authorCondition = {
        where: {
          name: { [Op.eq]: args.filters.author },
        },
      };
      const author = await _context.models.Author.findOne(authorCondition);

      if (author) {
        query.conditions.include.push({
          model: _context.models.Author,
          where: { id: author.getDataValue("id") },
          require: true,
        });
      }
    }

    // pagination
    if (args.filters.cursor) {
      query.conditions.where.id = { [Op.gt]: args.filters.cursor };
    } else {
      delete query.conditions.where.id;
    }

    if (args.filters.page) {
      query.conditions.offset =
        (args.filters.page - 1) * query.conditions.limit;
    } else {
      delete query.conditions.offset;
    }

    if (args.filters.limit) {
      query.conditions.limit = args.filters.limit;
    }

    // resolve status type and filter
    if (args.filters.featured) {
      query.conditions.where.featured = args.filters.featured;
    } else {
      delete query.conditions.where.featured;
    }

    // resolve type
    if (args.filters.type) {
      query.conditions.where.type = args.filters.type;
    } else {
      delete query.conditions.where.type;
    }

    // resolve status
    if (args.filters.status) {
      query.conditions.where.status = { [Op.eq]: args.filters.status } as any;
    }

    // sort
    if (args.filters.sortBy) {
      query.conditions.order = [["publishedAt", args.filters.sortBy]];
    }

    // if (user && user.id) {
    //   args.conditions.order = [
    //     ["updatedAt", args.sortBy === "oldest" ? "ASC" : "DESC"],
    //   ];
    // }

    const posts = await _context.models.Post.findAll(query.conditions);

    return posts.map(post => post.toJSON());
  },

  async post(_parent, args, _context, _info) {
    const { previewHash, ...filters } = args.filters;
    const conditions = { where: { ...filters } };
    if (args.filters.id) {
      conditions.where.id = args.filters.id;
    }
    if (args.filters.slug) {
      conditions.where.slug = args.filters.slug;
    }
    if (previewHash) {
      conditions.where.id = Number(decrypt(previewHash));
      delete conditions.where.status;
    }

    const post = await _context.models.Post.findOne(conditions);

    return post.toJSON();
  },
};

export default { Query };
