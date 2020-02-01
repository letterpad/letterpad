export default {
  Query: {
    taxonomies: (root, args, { models }) => {
      let conditions = {
        where: {},
        order: [["name", "ASC"]],
      };
      if (args.filters) {
        let { active, type } = args.filters;
        if (typeof active === "undefined") {
          active = true;
        }
        if (type) {
          conditions.where.type = type;
        }
        if (active === true) {
          // return only active taxonomies
          conditions.include = [
            {
              model: models.Post,
              where: { status: "publish" },
              required: true,
            },
          ];
          conditions.group = ["taxonomy_id", "post_id"];
        }
      }

      return models.Taxonomy.findAll(conditions);
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
