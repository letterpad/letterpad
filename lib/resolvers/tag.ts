import { ResolverContext } from "./../apollo";
import { QueryResolvers } from "./../../__generated__/lib/type-defs.graphqls";
import models from "../../db/models";

const Query: QueryResolvers<ResolverContext> = {
  async tags(_root, args, _context) {
    let conditions = {
      where: {},
      order: [["name", "ASC"]],
    };
    if (args.filters) {
      let { active, name } = args.filters;
      if (typeof active === "undefined") {
        active = true;
      }

      if (name) {
        conditions.where.name = name;
      }
      if (active === true) {
        // return only active taxonomies
        conditions.include = [
          {
            model: models.Post,
            where: { status: "published" },
            required: true,
          },
        ];
        conditions.group = ["tag_id", "post_id"];
      }
    }

    const taxonomies = await models.Tags.findAll(conditions);

    const type = "tag";

    return taxonomies.map(taxonomy => {
      taxonomy.slug = "/" + type + "/" + taxonomy.slug;
      return taxonomy;
    });
  },
};

const Tags = {
  async posts({ id }, args) {
    const tag = await models.Tags.findOne({ where: { id } });
    const posts = await tag?.getPosts({ where: { status: "published" } });
    return {
      count: posts?.length,
      rows: posts?.map(post => post?.get()),
    };
  },
};

export default { Query, Tags };
