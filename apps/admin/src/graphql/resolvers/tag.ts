import {
  MutationResolvers,
  QueryResolvers,
  Tag,
  TagResolvers,
  TagType,
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
  async popularTags(_root, args, { prisma }) {
    const tags: Tag[] =
      await prisma.$queryRaw`SELECT count(*) as count, T.name, T.slug FROM _PostToTag 
    INNER JOIN Tag T ON B = T.name
    group by T.name HAVING count > 5 order by count DESC`;

    return {
      ok: true,
      rows: tags.map((tag) => ({
        name: tag.name,
        slug: tag.name,
        count: Number(tag.count),
        id: tag.name,
        type: TagType.Tag,
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
