import { requiresAdmin } from "../utils/permissions";

export default {
  Query: {
    themeSettings: async (root, args, { models }) => {
      const settings = await models.Theme.findAll({ where: args });
      const parsedSettings = settings.map(({ dataValues }) => {
        return {
          name: dataValues.name,
          value: dataValues.value,
          settings: JSON.parse(dataValues.settings),
        };
      });
      return parsedSettings;
    },
  },
  Mutation: {
    insertThemeSettings: requiresAdmin.createResolver(
      async (root, args, { models }) => {
        args.settings = JSON.stringify(args.settings);
        const result = models.Theme.create(args);
        return result ? true : false;
      },
    ),
    updateThemeSettings: requiresAdmin.createResolver(
      async (root, args, { models }) => {
        const { settings, name } = args;
        console.log("args===================> :", args);
        const result = await models.Theme.update(
          { settings: JSON.stringify(settings) },
          { where: { name } },
        );
        return result ? true : false;
      },
    ),
  },
};
