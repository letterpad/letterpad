import Sequelize from "sequelize";

export default {
  Query: {
    globalSearch: async (root, args, { models }) => {
      const data = {
        posts: [],
        pages: [],
        tags: [],
      };
      const posts = await models.Post.findAll({
        attributes: ["id", "title", "type"],
        where: {
          title: {
            [Sequelize.Op.like]: "%" + args.keyword + "%",
          },
        },
        raw: true,
      });

      posts.forEach(item => {
        const { type } = item;
        if (type === "page") {
          data.pages.push(item);
        } else {
          data.posts.push(item);
        }
      });

      const taxonomies = await models.Taxonomy.findAll({
        attributes: ["id", "name", "type"],
        where: {
          name: {
            [Sequelize.Op.like]: "%" + args.keyword + "%",
          },
        },
        raw: true,
      });

      taxonomies.forEach(item => {
        const { type } = item;
        item.title = item.name;
        if (type === "post_tag") {
          data.tags.push(item);
        }
      });

      return {
        ok: true,
        data,
        errors: [],
      };
    },
  },
};
