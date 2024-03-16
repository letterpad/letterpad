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
    { session, prisma, client_author_id }: ResolverContext
  ): Promise<PostsResponse> => {
    const authorId = session?.user.id || client_author_id;
    if (!authorId) {
      return {
        __typename: "Exception",
        message: "You must be logged in to view this page",
      };
    }

    const posts = await prisma.post.findMany({
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
    return {
      __typename: "PostsNode",
      count: posts?.length,
      rows: posts.map(mapPostToGraphql),
    };
  }
);
