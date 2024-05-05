import { Prisma } from "@prisma/client";
import {
  PostsResponse,
  PostStatusOptions,
  PostTypes,
  QueryLetterpadLatestPostsArgs,
} from "letterpad-graphql";

import { ResolverContext } from "@/graphql/context";
import { mapPostToGraphql } from "@/graphql/resolvers/mapper";

export const getLetterpadLatestPosts = async (
  args: Partial<QueryLetterpadLatestPostsArgs>,
  { prisma, dataloaders }: ResolverContext
): Promise<PostsResponse> => {
  const cursor = args.filters?.cursor
    ? {
      cursor: {
        id: args.filters.cursor,
      },
    }
    : {};

  const tags = args.filters?.tag ? {
    tags: {
      some: {
        slug: args.filters?.tag,
      },
    },
  } : {};

  const condition: Prisma.PostFindManyArgs = {
    where: {
      ...tags,
      status: PostStatusOptions.Published,
      type: PostTypes.Post,
      excerpt: {
        not: {
          equals: "",
        },
      },
      html: {
        not: {
          equals: "",
        },
      },
      banned: false,
      NOT: [
        {
          title: {
            equals: "",
          },
        },
        {
          title: {
            equals: "Coming Soon",
          },
        },
      ],
    },
    skip: cursor.cursor?.id ?? 0 > 0 ? 1 : 0,
    take: 13,
    ...cursor,
    orderBy: {
      publishedAt: "desc",
    },
    select: {
      id: true,
    },
  };
  try {
    // const posts = await prisma.post.findMany(condition);
    const postIds = await prisma.post.findMany(condition);
    const posts = await dataloaders.post.loadMany(
      postIds.map((p) => p.id)
    );

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
