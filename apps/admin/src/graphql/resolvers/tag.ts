import { fieldsMap } from "graphql-fields-list";
import {
  MutationResolvers,
  PostStatusOptions,
  PostTypes,
  QueryResolvers,
  TagResolvers,
  TagType,
} from "letterpad-graphql";

import { ResolverContext } from "@/graphql/context";
import { createPathWithPrefix } from "@/utils/slug";

import {
  deleteTags,
  getPostsFromTag,
  getTag,
  getTags,
  updateTags,
} from "../services/tag";
import { beautifyTopic, TOPIC_PREFIX } from "../../shared/utils";

const Query: QueryResolvers<ResolverContext> = {
  async tag(_root, args, context) {
    return getTag(args, context);
  },
  async tags(_root, args, context) {
    return getTags(args, context);
  },
  async popularTags(_root, args, { prisma }) {
    const tags = await prisma.tag.findMany({
      where: { name: { startsWith: TOPIC_PREFIX } },
      select: {
        name: true,
        _count: {
          select: {
            posts: {
              where: {
                status: PostStatusOptions.Published,
                type: PostTypes.Post,
                banned: false,
                title: { notIn: ["Coming Soon", ""] },
                excerpt: { not: "" },
                html: { not: "" },
              },
            },
          },
        },
      },
    });
    return {
      ok: true,
      rows: tags
        .filter(
          (tag) => tag.name.startsWith(TOPIC_PREFIX) && tag._count.posts > 2
        )
        .sort(
          (a, b) =>
            b._count.posts - a._count.posts || a.name.localeCompare(b.name)
        )
        .map((tag) => ({
          name: beautifyTopic(tag.name),
          slug: tag.name,
          count: tag._count.posts,
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
  async posts({ id }, _args, context, info) {
    const fields = fieldsMap(info);
    return getPostsFromTag(id, context, fields);
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
