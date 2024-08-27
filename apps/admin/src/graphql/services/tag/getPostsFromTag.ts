import {
  PostsResponse,
  PostStatusOptions,
} from "letterpad-graphql";
import { cache } from "react";

import { ResolverContext } from "@/graphql/context";
import { mapPostToGraphql } from "@/graphql/resolvers/mapper";

export const getPostsFromTag = cache(
  async (
    name: string,
    { session, prisma, client_author_id, dataloaders }: ResolverContext
  ): Promise<PostsResponse> => {
    const authorId = session?.user.id || client_author_id;
    if (!authorId) {
      return {
        __typename: "Exception",
        message: "You must be logged in to view this page",
      };
    }
    const postIds = await prisma.post.findMany({
      select: {
        id: true
      },
      where: {
        status: session?.user.id ? undefined : PostStatusOptions.Published,
        author: {
          id: authorId,
        },
        tags: {
          some: {
            name,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const posts = await dataloaders.post.loadMany(
      postIds.map((p) => p.id)
    );

    return {
      __typename: "PostsNode",
      count: posts?.length,
      rows: posts.map(p => mapPostToGraphql(p)),
    };
  }
);
