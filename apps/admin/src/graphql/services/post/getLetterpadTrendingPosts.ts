import { MapResult } from "graphql-fields-list";
import { PostsResponse } from "letterpad-graphql";

import { ResolverContext } from "@/graphql/context";
import { mapPostToGraphql } from "@/graphql/resolvers/mapper";

export const getLetterpadTrendingPosts = async (
  _args,
  { prisma }: ResolverContext,
  _fields: MapResult
): Promise<PostsResponse> => {
  try {
    const trendingIds = await prisma.trending.findMany({
      orderBy: {
        updatedAt: "desc",
      },
      take: 6,
    });

    const posts = await prisma.post.findMany({
      where: {
        id: {
          in: trendingIds.map((p) => p.post_id),
        },
      },
    });

    return {
      __typename: "PostsNode",
      rows: posts?.map((p) => mapPostToGraphql(p)),
      count: posts.length,
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
