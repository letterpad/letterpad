import {
  PostStatusOptions,
  QueryPostArgs,
  ResolversTypes,
} from "@/__generated__/__types__";
import { ResolverContext } from "@/graphql/context";
import { mapPostToGraphql } from "@/graphql/resolvers/mapper";
import { decrypt } from "@/graphql/utils/crypto";

import { PostVersion } from "../../../lib/versioning";
import { parseDrafts } from "../../../utils/utils";

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

  const postId = previewHash
    ? Number(decrypt(previewHash?.replace(/%3D/g, "=")))
    : id;

  if (postId) {
    const post = await prisma.post.findUnique({
      where: {
        id: postId,
      },
    });
    if (
      !previewHash &&
      session_author_id &&
      post?.author_id !== session_author_id
    ) {
      return {
        __typename: "UnAuthorized",
        message: "You dont have access to view this post.",
      };
    }
    if (post) {
      const pv = new PostVersion(parseDrafts(post.html_draft));
      const draftContent =
        pv.retrieveBlogAtTimestamp(
          pv.retrieveActiveVersion()?.timestamp ?? ""
        ) ?? "";
      const html =
        post.status === PostStatusOptions.Published && !previewHash
          ? post.html ?? draftContent
          : draftContent;
      return { ...mapPostToGraphql(post), html, __typename: "Post" };
    }
    return { __typename: "NotFound", message: "Post not found" };
  }

  try {
    const post = await prisma.post.findFirst({
      where: {
        id: postId,
        author_id: client_author_id,
        status:
          !session_author_id && !postId
            ? PostStatusOptions.Published
            : undefined,
        slug: slug?.split("/").pop(),
      },
    });

    if (post) {
      return { ...mapPostToGraphql(post), __typename: "Post" };
    }
  } catch (e: unknown) {
    if (e instanceof Error) {
      return { __typename: "Exception", message: e.message };
    }
  }
  return { __typename: "NotFound", message: "Post not found" };
};
