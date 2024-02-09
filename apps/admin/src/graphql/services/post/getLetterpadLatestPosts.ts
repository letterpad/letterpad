import { Prisma } from "@prisma/client";

import {
  PostStatusOptions,
  PostTypes,
  QueryLetterpadLatestPostsArgs,
  ResolversTypes,
} from "@/__generated__/__types__";
import { ResolverContext } from "@/graphql/context";
import { mapPostToGraphql } from "@/graphql/resolvers/mapper";

export const getLetterpadLatestPosts = async (
  args: Partial<QueryLetterpadLatestPostsArgs>,
  { prisma }: ResolverContext
): Promise<ResolversTypes["PostsResponse"]> => {
  const cursor = args.cursor
    ? {
        cursor: {
          id: args.cursor,
        },
      }
    : {};

  const condition: Prisma.PostFindManyArgs = {
    where: {
      status: PostStatusOptions.Published,
      type: PostTypes.Post,
      excerpt: {
        not: {
          equals: "",
        },
      },
      title: {
        not: {
          equals: "Coming Soon",
        },
      },
    },
    skip: cursor.cursor?.id ?? 0 > 0 ? 1 : 0,
    take: 13,
    ...cursor,
    orderBy: {
      publishedAt: "desc",
    },
  };
  try {
    const posts = await prisma.post.findMany(condition);
    return {
      __typename: "PostsNode",
      rows: posts
        .map(mapPostToGraphql)
        .filter((row) => (row.html?.length ?? 0) > 800),
      count: await prisma.post.count({ where: condition.where }),
    };
  } catch (e: any) {
    // eslint-disable-next-line no-console
    console.log(e);
    return {
      __typename: "Exception",
      message: "Internal Server Error",
    };
  }
};
