import { SortBy } from "./../../__generated__/lib/queries/partial.graphql";
import { Op, Order } from "sequelize";
import { QueryResolvers } from "./../../__generated__/lib/type-defs.graphqls";
import { ResolverContext } from "./../apollo";
import models from "../../db/models";
import { getModifiedSession } from "./helpers";

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
  media: async (_root, args, context) => {
    const session = await getModifiedSession(context);

    if (!session) {
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

export default { Query };
