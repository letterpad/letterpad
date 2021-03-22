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
    if (!args.filters.type) {
      args.filters.type = PostTypes.post;
    }

    // the query params can be a type of the post
    const query = {
      ...args.filters,
      conditions: { include: [], where: {}, limit: 20 },
    };

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
