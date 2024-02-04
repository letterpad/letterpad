import {
  MutationResolvers,
  QueryResolvers,
  TagResolvers,
} from "@/__generated__/__types__";
import { ResolverContext } from "@/graphql/context";
import { createPathWithPrefix } from "@/utils/slug";

import {
  deleteTags,
  getPostsFromTag,
  getTag,
  getTags,
  updateTags,
} from "../services/tag";
import { categoryNameToSlug } from "../../utils/utils";

const Query: QueryResolvers<ResolverContext> = {
  async tag(_root, args, context) {
    return getTag(args, context);
  },
  async tags(_root, args, context) {
    return getTags(args, context);
  },
  async categories(_root, args, { prisma }) {
    const tags = await prisma.tag.groupBy({
      by: ["category"],
      _count: {
        category: true,
      },
      where: {
        posts: {
          some: {
            status: "published",
          },
        },
      },
    });
    return {
      ok: true,
      rows: tags.map((tag) => ({
        name: tag.category,
        slug: categoryNameToSlug(tag.category),
        count: tag._count.category,
      })),
    };
  },
};

const Tag: TagResolvers<ResolverContext> = {
  async slug({ slug }) {
    return createPathWithPrefix(slug, "tag");
  },
  async posts({ id }, _args, context) {
    return getPostsFromTag(id, context);
  },
};

const Mutation: MutationResolvers<ResolverContext> = {
  async updateTags(_root, args, context) {
    return updateTags(args, context);
  },

  async deleteTags(_root, args, context) {
    return deleteTags(args, context);
  },
};
export default { Query, Tag, Mutation };
