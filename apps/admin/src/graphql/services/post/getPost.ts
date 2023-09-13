import { PostVersion } from "@/lib/versioning";

import {
  PostStatusOptions,
  QueryPostArgs,
  ResolversTypes,
} from "@/__generated__/__types__";
import { ResolverContext } from "@/graphql/context";
import { mapPostToGraphql } from "@/graphql/resolvers/mapper";
import { decrypt } from "@/graphql/utils/crypto";
import { parseDrafts } from "@/utils/utils";

export const getPost = async (
  args: QueryPostArgs,
  { prisma, session, client_author_id }: ResolverContext
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
    const postId = Number(decrypt(previewHash?.replace(/%3D/g, "=")));
    if (postId) {
      const post = await prisma.post.findUnique({
        where: {
          id: postId,
        },
      });

      if (post) {
        const pv = new PostVersion(parseDrafts(post.html_draft));
        const activeCommit = pv.retrieveActiveVersion()?.timestamp ?? "";
        const html_draft = pv.retrieveBlogAtTimestamp(activeCommit) ?? "";
        return { ...mapPostToGraphql(post), html_draft, __typename: "Post" };
      }
    }

    return {
      __typename: "NotFound",
      message: "Post was not found",
    };
  }

  if (id) {
    const post = await prisma.post.findUnique({
      where: {
        id: id,
      },
    });

    if (post) {
      if (session_author_id && post?.author_id !== session_author_id) {
        return {
          __typename: "NotFound",
          message: "Post was not found",
        };
      }

      const pv = new PostVersion(parseDrafts(post.html_draft ?? ""));
      const activeCommit = pv.retrieveActiveVersion()?.timestamp ?? "";
      const html = pv.retrieveBlogAtTimestamp(activeCommit) ?? "";
      return {
        ...mapPostToGraphql(post),
        html_draft: html,
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
};
