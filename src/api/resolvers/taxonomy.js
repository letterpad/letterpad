export default {
  Query: {
    taxonomies: async (root, args, { models }) => {
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

      const taxonomies = await models.Taxonomy.findAll(conditions);
      return taxonomies.map(item => {
        const type = item.type === "post_category" ? "category" : "tag";
        item.slug = "/" + type + "/" + item.slug;
        return item;
      });
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
        if (args.type === "post_category") {
          // menu can have a category. update the slug and name
          const menu = await models.Setting.findOne({
            where: { option: "menu" },
            raw: true,
          });
          const parsedMenu = JSON.parse(menu.value);
          const updatedMenu = parsedMenu.map(item => {
            if (item.type === "category") {
              item.slug = args.slug;
              item.originalName = args.name;
            }
            return item;
          });

          await models.Setting.update(
            { value: JSON.stringify(updatedMenu) },
            { where: { option: "menu" } },
          );
        }
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
