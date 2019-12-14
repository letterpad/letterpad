import Sequelize from "sequelize";
import { UnauthorizedError } from "../utils/common";
import { editPostPerm } from "../utils/permissions";

function IsJsonString(str) {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
}

function getConditions(columns, args) {
  const obj = {};
  const conditions = {};
  for (const field in args) {
    if (columns.indexOf(field) >= 0) {
      obj[field] = IsJsonString(args[field])
        ? JSON.parse(args[field])
        : args[field];
    } else {
      conditions[field] = args[field];
    }
  }
  conditions.where = obj;
  return conditions;
}
export default {
  Query: {
    media: async (root, args, { user, models }) => {
      if (!user || !user.id) {
        throw new UnauthorizedError({ url: "/media" });
      }
      const conditions = { include: [], where: {}, limit: 20 };
      if (args.filters) {
        const { id, authorId, cursor, limit, page } = args.filters;

        if (id) {
          conditions.where = { ...conditions.where, id };
        }
        if (authorId) {
          conditions.where = { ...conditions.where, authorId };
        }
        if (limit) {
          conditions.limit = limit;
        }
        if (cursor) {
          conditions.where.id = { [Sequelize.Op.gt]: cursor };
        } else if (page) {
          conditions.offset = (page - 1) * conditions.limit;
        }
      }
      conditions.order = [["id", "DESC"]];
      const result = await models.Media.findAndCountAll(conditions);
      return {
        count: result.count,
        rows: result.rows,
      };
    },
  },
  Mutation: {
    insertMedia: editPostPerm.createResolver((root, args, { user, models }) => {
      const data = {};
      Object.keys(args).forEach(field => {
        data[field] = args[field];
      });
      data.authorId = user.id;
      return models.Media.create(data);
    }),

    deleteMedia: editPostPerm.createResolver(async (root, args, { models }) => {
      await models.Media.destroy({
        where: { id: { [Sequelize.Op.in]: args.ids.split(",").map(Number) } },
      });
      return {
        ok: true,
      };
    }),

    updateMedia: editPostPerm.createResolver(async (root, args, { models }) => {
      try {
        await models.Media.update(args, {
          where: { id: args.id },
        });
        return { ok: true, errors: [] };
      } catch (e) {
        return {
          ok: false,
          errors: [
            {
              message: e.message,
              path: "updateMedia",
            },
          ],
        };
      }
    }),
  },
};
