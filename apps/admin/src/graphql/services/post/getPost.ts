import { MapResult } from "graphql-fields-list";
import {
  PostResponse,
  PostStatusOptions,
  QueryPostArgs,
} from "letterpad-graphql";
import { cache } from "react";

import { ResolverContext } from "@/graphql/context";
import { mapPostToGraphql } from "@/graphql/resolvers/mapper";
import { getMatchingFields as getMatchingPostFields } from "@/graphql/utils/getMatchingFields";

export const getPost = cache(
  async (
    args: QueryPostArgs,
    { prisma, session, client_author_id, dataloaders }: ResolverContext,
    fields: MapResult
  ): Promise<PostResponse> => {
    const callSource = client_author_id ? "client" : "server";
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
      const postId = previewHash;
      if (postId) {
        const post = await prisma.post.findFirst({ where: { id: postId } });
        if (post) {
          return {
            ...mapPostToGraphql(post, callSource),
            html: post.html_draft ?? "",
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
      const selections = getMatchingPostFields(fields);
      const post = await dataloaders
        .post([...selections, "author_id"])
        .load(id);
      if (post) {
        if (session_author_id && post?.author_id !== session_author_id) {
          return {
            __typename: "NotFound",
            message: "Post was not found",
          };
        }
        return {
          ...mapPostToGraphql(post, callSource),
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
          author_id: client_author_id!,
          status: PostStatusOptions.Published,
          slug: slug?.split("/").pop(),
        },
      });
      if (post) {
        return { ...mapPostToGraphql(post, callSource), __typename: "Post" };
      }
      return {
        __typename: "NotFound",
        message: "Post was not found",
      };
    }

    return { __typename: "NotFound", message: "Post not found" };
  }
);
