export default {
  Query: {
    taxonomies: (root, args, { models }) => {
      const cleanArgs = {};
      Object.keys(args).map(key => {
        if (args[key]) {
          cleanArgs[key] = args[key];
        }
      });
      return models.Taxonomy.findAll({
        where: cleanArgs,
        order: [["name", "ASC"]],
      });
    },
    activeTaxonomies: (root, args, { models, user }) => {
      let { postType, type, taxId } = args;

      let where = {};
      if (!user || !user.id) {
        where.status = "publish";
      }
      if (postType) {
        where.type = postType;
      }

      let query = {
        include: [
          {
            model: models.Post,
            as: "posts",
            where,
            required: true,
          },
        ],
        order: [["name", "ASC"]],
        where: { type },
        group: ["taxonomy_id", "post_id"],
      };
      if (taxId) {
        query.where.id = taxId;
      }
      if (args.slug) {
        query.where.slug = args.slug;
      }
      return models.Taxonomy.findAll(query);
    },
  },
  Mutation: {
    updateTaxonomy: async (root, args, { models }) => {
      if (!args.edit) {
        let found = await models.Taxonomy.findOne({
          where: { name: args.name, type: args.type },
        });
        if (found) {
          return {
            ok: false,
            id: null,
            errors: [{ message: "Already exist", path: "Taxonomy" }],
          };
        }
      }
      if (args.id == 0) {
        //create

        let item = await models.Taxonomy.create({
          name: args.name,
          desc: args.desc,
          type: args.type,
          slug: args.slug,
        });

        return {
          ok: true,
          errors: [],
          id: item.id,
        };
      } else {
        let id = await models.Taxonomy.update(
          {
            name: args.name,
            desc: args.desc,
            type: args.type,
            slug: args.slug,
          },
          {
            where: { id: args.id },
          },
        );

        return {
          ok: true,
          errors: [],
          id: args.id,
        };
      }
    },
    deleteTaxonomy: async (root, args, { models }) => {
      const destroy = models.Taxonomy.destroy({ where: { id: args.id } });
      if (destroy) {
        return {
          ok: true,
          errors: [],
          id: args.id,
        };
      }
    },
  },
};
