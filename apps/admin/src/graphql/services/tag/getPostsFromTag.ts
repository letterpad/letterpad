import { eq, SQL } from "drizzle-orm";

import {
  PostStatusOptions,
  ResolversParentTypes,
} from "@/__generated__/__types__";
import { ResolverContext } from "@/graphql/context";
import { mapPostToGraphql } from "@/graphql/resolvers/mapper";

import { Post } from "../../../../drizzle/schema";
import { db } from "../../../lib/drizzle";

export const getPostsFromTag = async (
  name: string,
  { session, prisma, client_author_id }: ResolverContext
): Promise<ResolversParentTypes["PostsResponse"]> => {
  const authorId = session?.user.id || client_author_id;
  if (!authorId) {
    return {
      __typename: "Exception",
      message: "You must be logged in to view this page",
    };
  }

  const where: SQL[] = [];
  if (session?.user.id) {
    where.push(eq(Post.status, PostStatusOptions.Published));
  }
  where.push(eq(Post.author_id, authorId));

  const posts = await db.query.Post.findMany({
    with: {
      postTags: {
        where: (pt, { ilike }) => ilike(pt.B, name),
      },
    },
    where: (_, { and }) => and(...where),
    orderBy: (post, { desc }) => desc(post.createdAt),
  });

  return {
    __typename: "PostsNode",
    count: posts?.length,
    rows: posts.map(mapPostToGraphql),
  };
};
