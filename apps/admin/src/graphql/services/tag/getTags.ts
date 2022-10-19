import {
  PostStatusOptions,
  QueryTagsArgs,
  ResolversTypes,
  Tag,
} from "@/__generated__/__types__";
import { ResolverContext } from "@/graphql/context";
import logger from "@/shared/logger";

export const getTags = async (
  args: QueryTagsArgs,
  { session, client_author_id, prisma }: ResolverContext,
): Promise<ResolversTypes["TagsResponse"]> => {
  const authorId = session?.user.id || client_author_id;

  if (args.filters?.suggest) {
    const tags = await prisma.tag.findMany({
      orderBy: {
        name: "asc",
      },
    });
    return {
      __typename: "TagsNode",
      rows: tags as Tag[],
    };
  }

  if (!authorId) {
    return {
      __typename: "TagsError",
      message: "Missing or invalid token or session",
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
            status: args.filters?.active
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
      rows: tags as Tag[],
    };
  } catch (e: any) {
    logger.error(e);
  }
  return {
    __typename: "TagsError",
    message: "Missing or invalid token or session",
  };
};
