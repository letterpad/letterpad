import { MapResult } from "graphql-fields-list";
import { PostsResponse } from "letterpad-graphql";

import { ResolverContext } from "@/graphql/context";
import { mapPostToGraphql } from "@/graphql/resolvers/mapper";

import { discoveryEligibilityWhere } from "./discoveryEligibility";

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
      take: 24,
    });

    const posts = await prisma.post.findMany({
      where: {
        id: {
          in: trendingIds.map((p) => p.post_id),
        },
        ...discoveryEligibilityWhere,
      },
    });
    const postsById = new Map(posts.map((post) => [post.id, post]));
    const rows = trendingIds
      .map((trending) => postsById.get(trending.post_id))
      .filter((post) => post !== undefined)
      .slice(0, 6);

    return {
      __typename: "PostsNode",
      rows: rows.map((post) => mapPostToGraphql(post)),
      count: rows.length,
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
