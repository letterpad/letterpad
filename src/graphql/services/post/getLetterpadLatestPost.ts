import {
  QueryLetterpadLatestPostArgs,
  ResolversTypes,
} from "@/__generated__/__types__";
import { ResolverContext } from "@/graphql/context";
import { mapPostToGraphql } from "@/graphql/resolvers/mapper";

export const getLetterpadLatestPost = async (
  args: QueryLetterpadLatestPostArgs,
  { prisma }: ResolverContext,
): Promise<ResolversTypes["PostResponse"]> => {
  if (!args.filters) {
    return {
      __typename: "InvalidArguments",
      message: "No object for `filters` provided as arguments",
    };
  }

  const { slug, username } = args.filters;

  if (username) {
    const author = await prisma.author.findUnique({
      where: { username },
    });
    if (!author) {
      return {
        __typename: "NotFound",
        message: "Author not found",
      };
    }

    const post = await prisma.post.findFirst({
      where: {
        slug,
        author: {
          id: author.id,
        },
      },
    });
    if (post) {
      const html = post.html_draft || post.html || "";
      return { ...mapPostToGraphql(post), html, __typename: "Post" };
    }
  }

  return { __typename: "NotFound", message: "Post not found" };
};
