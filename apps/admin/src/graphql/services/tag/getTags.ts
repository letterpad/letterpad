import { cache } from "react";

import { prisma } from "@/lib/prisma";

import {
  PostStatusOptions,
  QueryTagsArgs,
  ResolversTypes,
  TagType,
} from "@/__generated__/__types__";
import { ResolverContext } from "@/graphql/context";
import logger from "@/shared/logger";

export const getTags = cache(
  async (
    args: QueryTagsArgs,
    { session, client_author_id, prisma }: ResolverContext
  ): Promise<ResolversTypes["TagsResponse"]> => {
    const authorId = session?.user.id || client_author_id;

    if (!authorId) {
      return {
        __typename: "UnAuthorized",
        message: "Missing or invalid token or session",
      };
    }

    if (args.filters?.suggest) {
      const tags = await prisma.tag.findMany({
        orderBy: {
          name: "asc",
        },
      });
      return {
        __typename: "TagsNode",
        rows: tags.map((tag) => ({
          ...tag,
          slug: tag.slug!,
          type: TagType.Tag,
          name: tag.name,
          id: tag.name,
        })),
      };
    }

    try {
      const rows = await getTagsLinkedWithPosts({
        name: args.filters?.name!,
        id: authorId,
        status:
          args.filters?.active || !session?.user.id
            ? PostStatusOptions.Published
            : undefined,
      });

      return {
        __typename: "TagsNode",
        rows,
      };
    } catch (e: any) {
      logger.error(e);
    }
    return {
      __typename: "UnAuthorized",
      message: "Missing or invalid token or session",
    };
  }
);

export async function getTagsLinkedWithPosts({
  name,
  id,
  status,
}: {
  name?: string;
  id: number;
  status?: PostStatusOptions;
}) {
  const tags = await prisma.tag.findMany({
    where: {
      name,
      posts: {
        some: {
          author: {
            id,
          },
          status,
        },
      },
    },
    orderBy: {
      name: "asc",
    },
  });

  const rows = tags.map((tag) => ({
    ...tag,
    slug: tag.slug!,
    type: TagType.Tag,
    name: tag.name,
    id: tag.name,
  }));

  return rows;
}
