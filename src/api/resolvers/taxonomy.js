import config from "../../config";
import { normalizePost } from "./post";

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

      const type = "tag";

      return taxonomies.map(taxonomy => {
        taxonomy.slug = config.BASE_NAME + "/" + type + "/" + taxonomy.slug;
        return taxonomy;
      });
    },
  },

  Taxonomy: {
    async posts(taxonomy) {
      const posts = await taxonomy.getPosts();
      return {
        count: posts.length,
        rows: posts.map(post => {
          post.dataValues = normalizePost(post.dataValues);
          return post;
        }),
      };
    },
  },

  Mutation: {
    updateTaxonomy: async (root, args, { models }) => {
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
        if (args.type === "post_tag") {
          // menu can have a category. update the slug and name
          const menu = await models.Setting.findOne({
            where: { option: "menu" },
            raw: true,
          });
          const parsedMenu = JSON.parse(menu.value);
          const updatedMenu = parsedMenu.map(item => {
            if (item.type === "tag") {
              item.slug = args.slug;
              item.original_name = args.name;
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
