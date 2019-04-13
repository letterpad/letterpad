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
      const columns = Object.keys(models.Post.rawAttributes);
      const conditions = getConditions(columns, args);

      const count = await models.Media.count(conditions);
      if (args.cursor) {
        conditions.where.id = { gt: args.cursor };
      }
      conditions.order = [["id", "DESC"]];
      const media = await models.Media.findAll(conditions);
      return {
        count,
        rows: media,
      };
    },
  },
  Mutation: {
    insertMedia: editPostPerm.createResolver((root, args, { user, models }) => {
      const data = {};
      Object.keys(args).forEach(field => {
        data[field] = args[field];
      });
      data.author_id = user.id;
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
