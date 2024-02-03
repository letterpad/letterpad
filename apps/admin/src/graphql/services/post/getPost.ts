import { cache } from "react";

import {
  PostStatusOptions,
  QueryPostArgs,
  ResolversTypes,
} from "@/__generated__/__types__";
import { ResolverContext } from "@/graphql/context";
import { mapPostToGraphql } from "@/graphql/resolvers/mapper";
import { decrypt } from "@/graphql/utils/crypto";

export const getPost = cache(
  async (
    args: QueryPostArgs,
    { prisma, session, client_author_id, dataloaders }: ResolverContext
  ): Promise<ResolversTypes["PostResponse"]> => {
    const session_author_id = session?.user.id;
    if (!args.filters) {
      return {
        __typename: "InvalidArguments",
        message: "Arguments { filters: {...} } are required}",
      };
    }

    const authorId = session_author_id || client_author_id;
    if (!authorId) {
      return {
        __typename: "NotFound",
        message: "No author found to query the post",
      };
    }

    const { previewHash, id, slug } = args.filters;

    if (previewHash) {
      const postId = parseInt(decrypt(previewHash));
      if (postId) {
        const post = await prisma.post.findFirst({ where: { id: postId } });
        if (post) {
          return {
            ...mapPostToGraphql(post),
            html_draft: post.html_draft ?? "",
            __typename: "Post",
          };
        }
      }

      return {
        __typename: "NotFound",
        message: "Post was not found",
      };
    }

    if (id) {
      const post = await dataloaders.post.load(id);

      if (post) {
        if (session_author_id && post?.author_id !== session_author_id) {
          return {
            __typename: "NotFound",
            message: "Post was not found",
          };
        }
        return {
          ...mapPostToGraphql(post),
          __typename: "Post",
        };
      }

      return {
        __typename: "NotFound",
        message: "Post was not found",
      };
    }

    if (slug) {
      const post = await prisma.post.findFirst({
        where: {
          author_id: client_author_id,
          status: PostStatusOptions.Published,
          slug: slug?.split("/").pop(),
        },
      });
      if (post) {
        return { ...mapPostToGraphql(post), __typename: "Post" };
      }
      return {
        __typename: "NotFound",
        message: "Post was not found",
      };
    }

    return { __typename: "NotFound", message: "Post not found" };
  }
);
