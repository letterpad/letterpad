import { Prisma } from "@prisma/client";

import {
  PostStatusOptions,
  PostTypes,
  ResolversTypes,
} from "@/__generated__/__types__";
import { ResolverContext } from "@/graphql/context";
import { mapPostToGraphql } from "@/graphql/resolvers/mapper";

export const getLetterpadLatestPosts = async (
  _args: unknown,
  { prisma }: ResolverContext
): Promise<ResolversTypes["PostsResponse"]> => {
  const condition: Prisma.PostFindManyArgs = {
    where: {
      status: PostStatusOptions.Published,
      type: PostTypes.Post,
      title: {
        not: {
          equals: "Welcome to Letterpad",
        },
      },
    },
    take: 20,
    orderBy: {
      updatedAt: "desc",
    },
  };
  try {
    const posts = await prisma.post.findMany(condition);

    return {
      __typename: "PostsNode",
      rows: posts.map(mapPostToGraphql),
      count: await prisma.post.count({ where: condition.where }),
    };
  } catch (e: any) {
    return {
      __typename: "Exception",
      message: "Internal Server Error",
    };
  }
};
