import { MutationResolvers } from "./../../../__generated__/src/graphql/type-defs.graphqls";
import { ResolverContext } from "../apollo";
import { QueryResolvers } from "@/__generated__/type-defs.graphqls";
import models from "../db/models";

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
  async posts({ id }) {
    const tag = await models.Tags.findOne({ where: { id } });
    const posts = await tag?.getPosts({ where: { status: "published" } });
    return {
      __typename: "PostsNode",
      count: posts?.length,
      rows: posts?.map(post => post?.get()),
    };
  },
};

const Mutation: MutationResolvers<ResolverContext> = {
  async updateTags(_root, args, _context) {
    if (!args.data) {
      return {
        __typename: "TagsError",
        message: "Arguments on found inside object data.",
      };
    }
    const tags = await models.Tags.update(args.data, {
      where: { id: args.data.id },
    });

    if (!tags) {
      return {
        __typename: "TagsError",
        message: "Failed to update tags",
      };
    }
    return {
      __typename: "EditTaxResponse",
      ok: true,
    };
  },

  async deleteTags(_root, args, _context) {
    if (!args.id) {
      return {
        __typename: "TagsError",
        message: "Arguments on found inside object data.",
      };
    }

    const deleteRowCount = await models.Tags.destroy({
      where: { id: args.id },
    });

    if (deleteRowCount === 1) {
      return {
        __typename: "DeleteTagsResult",
        ok: true,
      };
    }
    return {
      __typename: "TagsError",
      message: "Unable to delete tag.",
    };
  },
};
export default { Query, Tags, Mutation };
