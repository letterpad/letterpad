import { GroupOption, Includeable, Order } from "sequelize";
import { MutationResolvers } from "./../../../__generated__/src/graphql/type-defs.graphqls";
import { ResolverContext } from "../apollo";
import { QueryResolvers } from "@/__generated__/type-defs.graphqls";
import models from "../db/models";

const Query: QueryResolvers<ResolverContext> = {
  async tags(_root, args, { session, author_id }) {
    let conditions: {
      where: {
        name?: string;
      };
      group?: GroupOption;
      include?: Includeable | Includeable[];
      order: Order;
    } = {
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

    if (session?.user) {
      const author = await models.Author.findOne({
        where: { id: session.user.id },
      });
      if (author) {
        const tags = await author.getTags(conditions);
        return {
          __typename: "TagsNode",
          rows: tags.map(tag => tag.get()),
        };
      }
    }

    if (author_id) {
      const author = await models.Author.findOne({
        where: { id: author_id },
      });
      if (author) {
        const tags = await author.getTags(conditions);
        return {
          __typename: "TagsNode",
          rows: tags.map(tag => tag.get()),
        };
      }
    }

    return {
      __typename: "TagsError",
      message: "Missing or invalid token or session",
    };
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
  async updateTags(_root, args, { session }) {
    if (!session?.user) {
      return {
        __typename: "TagsError",
        message: "No session found",
      };
    }

    const author = await models.Author.findOne({
      where: { id: session.user.id },
    });

    if (!args.data || !author) {
      return {
        __typename: "TagsError",
        message: "Incorrect arguments",
      };
    }

    let tag: unknown;
    if (args.data.id === 0) {
      tag = await author.createTag(args.data);
    } else {
      tag = await models.Tags.update(args.data, {
        where: { id: args.data.id },
      });
    }

    if (!tag) {
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
        message: "Incorrect arguments",
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
