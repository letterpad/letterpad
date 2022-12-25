import {
  PostStatusOptions,
  QueryPostArgs,
  ResolversTypes,
} from "@/__generated__/__types__";
import { ResolverContext } from "@/graphql/context";
import { mapPostToGraphql } from "@/graphql/resolvers/mapper";
import { decrypt } from "@/graphql/utils/crypto";

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

  const postId = previewHash ? Number(decrypt(previewHash)) : id;

  if (postId) {
    const post = await prisma.post.findUnique({
      where: {
        id: postId,
      },
    });
    if (post) {
      const html =
        post.status === PostStatusOptions.Published
          ? post.html ?? post.html_draft
          : post.html_draft;
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
