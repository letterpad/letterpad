import { MutationResolvers } from "./../../../__generated__/src/graphql/type-defs.graphqls";
import { Op, Order } from "sequelize";
import { ResolverContext } from "../apollo";
import models from "../db/models";
import { QueryResolvers, SortBy } from "@/__generated__/type-defs.graphqls";

interface IMediaConditions {
  limit: number;
  order: Order;
  offset?: number;
  where: {
    author_id?: number;
    id?: number | object;
  };
}

const Query: QueryResolvers<ResolverContext> = {
  media: async (_root, args, { session }) => {
    if (!session?.user) {
      return {
        count: 0,
        rows: [],
      };
    }
    const conditions: IMediaConditions = {
      where: {},
      limit: 20,
      order: [["id", SortBy.Desc]],
    };

    if (args.filters) {
      const { id, authorId, cursor, limit, page } = args.filters;

      if (id) {
        conditions.where = { ...conditions.where, id };
      }
      if (authorId) {
        conditions.where = { ...conditions.where, author_id: authorId };
      }
      if (limit) {
        conditions.limit = limit;
      }
      if (cursor) {
        conditions.where.id = { [Op.gt]: cursor };
      } else if (page) {
        conditions.offset = (page - 1) * conditions.limit;
      }
    }
    const result = await models.Media.findAndCountAll(conditions);

    if (result) {
      const rows = result.rows.map(item => item.get());
      return {
        count: result.count,
        rows: rows,
      };
    }

    return {
      count: 0,
      rows: [],
    };
  },
};

const Mutation: MutationResolvers<ResolverContext> = {
  deleteMedia: async (_, args, { session }) => {
    if (!session?.user) {
      return {
        __typename: "MediaError",
        message: "No Auhentication",
      };
    }
    const author = await models.Author.findOne({
      where: { id: session.user.id },
    });
    if (!author) {
      return {
        __typename: "MediaError",
        message: "Author not found",
      };
    }
    await Promise.all([
      ...args.ids.map(id =>
        models.Media.destroy({ where: { id: id, author_id: session.user.id } }),
      ),
    ]);

    return {
      __typename: "MediaDeleteResult",
      ok: true,
    };
  },

  updateMedia: async (_, args, { session }) => {
    if (!session?.user) {
      return {
        __typename: "MediaError",
        message: "No Auhentication",
      };
    }

    const [updates] = await models.Media.update(args.data, {
      where: { id: args.data.id, author_id: session.user.id },
    });

    if (updates === 0) {
      return {
        __typename: "MediaError",
        message: "Media not found",
      };
    }
    return {
      __typename: "MediaUpdateResult",
      ok: true,
    };
  },
};

export default { Query, Mutation };
