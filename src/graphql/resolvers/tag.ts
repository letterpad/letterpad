import { GroupOption, Includeable, Order } from "sequelize";

import {
  QueryResolvers,
  MutationResolvers,
  InputTags,
} from "@/__generated__/__types__";
import { ResolverContext } from "../context";

const Query: QueryResolvers<ResolverContext> = {
  async tag(_root, args, { session, author_id, models }) {
    const authorId = session?.user.id || author_id;

    if (!authorId) {
      return {
        __typename: "TagResultError",
        message: "You dont have access to get this resource",
      };
    }

    const tag = await models.Tag.findOne({ where: { slug: args.slug } });

    if (tag) {
      return {
        __typename: "Tags",
        ...tag.get(),
      };
    }
    return {
      __typename: "TagResultError",
      message: "Tag not found",
    };
  },
  async tags(_root, args, { session, author_id, models }) {
    const authorId = session?.user.id || author_id;

    if (!authorId) {
      return {
        __typename: "TagsError",
        message: "Missing or invalid token or session",
      };
    }
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

    const author = await models.Author.findOne({
      where: { id: authorId },
    });
    if (author) {
      const tags = await author.$get("tags", conditions);
      return {
        __typename: "TagsNode",
        rows: tags.map((tag) => tag.get()),
      };
    }

    return {
      __typename: "TagsError",
      message: "Missing or invalid token or session",
    };
  },
};

const Tags = {
  async posts({ id }, _args, { models }) {
    const tag = await models.Tag.findOne({ where: { id } });
    const posts = await tag?.$get("posts", {
      where: { status: "published" },
      order: [["id", "desc"]],
    });
    return {
      __typename: "PostsNode",
      count: posts?.length,
      rows: posts?.map((post) => post?.get()),
    };
  },
};

const Mutation: MutationResolvers<ResolverContext> = {
  async updateTags(_root, args, { session, models }) {
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
    args.data.slug = args.data.slug?.split("/").pop();

    if (args.data.id === 0) {
      const { id, ...rest } = args.data;
      tag = await author.$create("tag", rest as InputTags);
    } else {
      tag = await models.Tag.update(args.data, {
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

  async deleteTags(_root, args, { models }) {
    if (!args.id) {
      return {
        __typename: "TagsError",
        message: "Incorrect arguments",
      };
    }
    const deleteRowCount = await models.Tag.destroy({
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
