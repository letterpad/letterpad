import { PostAttributes } from "./../../db/models/post";
import { PostTypes } from "./../../__generated__/lib/queries/partial.graphql";
import { Op, Order } from "sequelize";
import {
  Permissions,
  PostFilters,
  PostStatusOptions,
  SortBy,
} from "../../__generated__/lib/type-defs.graphqls";
import { QueryResolvers } from "../type-defs.graphqls";
import { ResolverContext } from "../apollo";
import { decrypt } from "../utils/crypto";
import models from "../../db/models";

interface IPostCondition {
  conditions: {
    order: Order;
    include: any;
    where: {
      id?: number | {};
      featured?: boolean;
      status: { [Op.ne]: PostStatusOptions.Trashed };
      type?: PostTypes;
      author_id?: number;
    };
    limit: number;
    offset?: number;
    sortBy: "ASC" | "DESC";
  };
}

const Post = {
  author: async ({ id }: PostAttributes) => {
    const post = await models.Post.findOne({ where: { id: id } });
    if (post) {
      const author = await post.getAuthor();
      return author.get();
    }
    return {};
  },
  tags: async ({ id }: PostAttributes) => {
    const post = await models.Post.findOne({ where: { id: id } });
    if (post) {
      const tags = await post.getTags();
      return tags.map(tag => tag.get());
    }
  },
};

const Query: QueryResolvers<ResolverContext> = {
  /**
   * Query to take care of multiple post in one page.
   * Used for Search and Admin posts and pages list.
   */
  async posts(_parent, args, context, _info) {
    // the query params can be a type of the post

    const query: IPostCondition = {
      conditions: {
        order: [["publishedAt", SortBy.Desc]],
        include: [],
        sortBy: "DESC",
        where: {
          id: 0,
          featured: false,
          status: { [Op.ne]: PostStatusOptions.Trashed },
          type: PostTypes.Post,
          author_id: 0,
        },
        limit: 20,
        offset: 0,
      },
    };

    // id
    if (args?.filters?.id) {
      query.conditions.where.id = args.filters.id;
    } else {
      delete query.conditions.where.id;
    }

    // pagination
    if (args?.filters?.cursor) {
      query.conditions.where.id = { [Op.gt]: args.filters.cursor };
    }

    if (args?.filters?.page) {
      query.conditions.offset =
        (args.filters.page - 1) * query.conditions.limit;
    } else {
      delete query.conditions.offset;
    }

    if (args?.filters?.limit) {
      query.conditions.limit = args.filters.limit;
    }

    // resolve status type and filter
    if (args?.filters?.featured) {
      query.conditions.where.featured = args.filters.featured;
    } else {
      delete query.conditions.where.featured;
    }

    // resolve type
    if (args?.filters?.type) {
      query.conditions.where.type = args.filters.type;
    }

    // resolve status
    if (args?.filters?.status) {
      query.conditions.where.status = { [Op.eq]: args.filters.status } as any;
    }

    // sort
    if (args?.filters?.sortBy) {
      query.conditions.order = [["publishedAt", args.filters.sortBy]];
    }

    if (context && context.session && args?.filters?.sortBy) {
      query.conditions.order = [["updatedAt", args.filters.sortBy]];
    }

    // resolve author
    if (args?.filters?.author) {
      const author = await models.Author.findOne({
        where: { name: args.filters.author },
      });
      delete query.conditions.where.author_id;

      if (author) {
        const posts = await author.getPosts(query.conditions);
        return posts.map(p => p.get());
      }
    } else {
      delete query.conditions.where.author_id;
    }

    // resolve menu filter

    if (args?.filters?.tagSlug) {
      let { tagSlug } = args.filters;
      if (tagSlug === "/") {
        // get the first menu item.
        const setting = await models.Setting.findOne({
          attributes: ["value"],
          where: { option: "menu" },
          raw: true,
        });

        tagSlug = setting ? JSON.parse(setting.value)[0].slug : null;
      }

      const taxTag = await models.Tags.findOne({
        where: { slug: tagSlug },
      });

      if (taxTag) {
        const posts = await taxTag.getPosts(query.conditions);
        return posts.map(p => p.get());
      }

      return [];
    }

    // resolve tag filter
    if (args?.filters?.tag) {
      const tag = await models.Tags.findOne({
        where: { name: args.filters.tag },
      });

      if (tag) {
        const posts = await tag.getPosts(query.conditions);
        return posts.map(p => p.get());
      } else {
        return [];
      }
    }

    const posts = await models.Post.findAll(query.conditions);

    return posts.map(post => post.get());
  },

  async post(_parent, args, context, _info) {
    if (!args.filters) return {};
    const session = await context.session;

    const { previewHash, ...filters } = args.filters;
    const conditions = {
      where: { ...filters, author_id: 0 } as PostFilters & {
        author_id?: number;
      },
    };

    if (session?.user.permissions) {
      //  Author should not see others posts from admin panel
      if (session.user.permissions.includes(Permissions.ManageOwnPosts)) {
        conditions.where.author_id = session.user.id;
      } else {
        delete conditions.where.author_id;
      }
    }

    if (!session) {
      conditions.where.status = PostStatusOptions.Published;
      delete conditions.where.author_id;
    }

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

    const post = await models.Post.findOne(conditions);

    return post ? post.get() : {};
  },
};

export default { Query, Post };
