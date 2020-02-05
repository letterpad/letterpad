import Sequelize from "sequelize";
import { UnauthorizedError } from "../utils/common";
import config from "../../config";
import { editPostPerm } from "../utils/permissions";

export default {
  Query: {
    media: async (root, args, { user, models }) => {
      if (!user || !user.id) {
        throw new UnauthorizedError({ url: "/media" });
      }
      const conditions = { where: {}, limit: 20 };
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
          conditions.where.id = { [Sequelize.Op.gt]: cursor };
        } else if (page) {
          conditions.offset = (page - 1) * conditions.limit;
        }
      }
      conditions.order = [["id", "DESC"]];
      const result = await models.Media.findAndCountAll(conditions);
      result.rows = result.rows.map(item => {
        item.url = config.BASE_NAME + item.url;
        return item;
      });
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
