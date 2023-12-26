import {
  PostStatusOptions,
  QueryTagsArgs,
  ResolversTypes,
  Tag,
  TagType,
} from "@/__generated__/__types__";
import { ResolverContext } from "@/graphql/context";
import logger from "@/shared/logger";
import { isCategory, tryToParseCategoryName } from "@/utils/utils";
import { cache } from "react";

export const getTags = cache(async (
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
        type: isCategory(tag.name) ? TagType.Category : TagType.Tag,
        name: tryToParseCategoryName(tag.name),
        id: tag.name,
      })),
    };
  }

  try {
    const tags = await prisma.tag.findMany({
      where: {
        name: args.filters?.name,
        posts: {
          some: {
            author: {
              id: authorId,
            },
            status:
              args.filters?.active || !session?.user.id
                ? PostStatusOptions.Published
                : undefined,
          },
        },
      },
      orderBy: {
        name: "asc",
      },
    });

    return {
      __typename: "TagsNode",
      rows: tags.map((tag) => ({
        ...tag,
        slug: tag.slug!,
        type: isCategory(tag.name) ? TagType.Category : TagType.Tag,
        name: tryToParseCategoryName(tag.name),
        id: tag.name,
      })),
    };
  } catch (e: any) {
    logger.error(e);
  }
  return {
    __typename: "UnAuthorized",
    message: "Missing or invalid token or session",
  };
});
