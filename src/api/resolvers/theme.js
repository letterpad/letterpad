import { requiresAdmin } from "../utils/permissions";

export default {
  Query: {
    themeSettings: async (root, args, { models }) => {
      return models.Theme.findAll({ where: args });
    },
  },
  Mutation: {
    insertThemeSettings: requiresAdmin.createResolver(
      async (root, args, { models }) => {
        return models.Theme.create(args);
      },
    ),
    updateThemeSettings: requiresAdmin.createResolver(
      async (root, args, { models }) => {
        const { settings, value, name } = args;
        const result = await models.Theme.update(
          { settings, value },
          { where: { name } },
        );
        return result ? true : false;
      },
    ),
  },
};
