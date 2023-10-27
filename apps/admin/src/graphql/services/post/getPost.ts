/* eslint-disable no-console */
import { Post } from "@prisma/client";

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
    const postId = Number(decrypt(previewHash?.replace(/%3D/g, "=")));
    if (postId) {
      const post = await dataloaders.post.load(id);

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
    // const post = await prisma.post.findFirst({
    //   where: {
    //     author_id: client_author_id,
    //     status: PostStatusOptions.Published,
    //     slug: slug?.split("/").pop(),
    //   },
    // });

    // Prisma has a problem with slow execution time. Writing this raw query because of that.
    const cleanSlug = slug?.split("/").pop();

    type t = ReturnType<typeof prisma.post.findFirst>;
    console.time("Raw Way");
    const post_ = await prisma.$queryRawUnsafe<[Post]>(
      `SELECT p.id, p.title, p.sub_title, p.html, p.excerpt, p.cover_image, p.type, p.status, p.featured, p.slug, p.createdAt, p.publishedAt, p.scheduledAt, p.updatedAt, p.reading_time, p.page_type, p.page_data, p.author_id FROM Post p INNER JOIN Author a ON p.author_id = a.id WHERE p.slug = $1 AND p.status = $2 AND p.author_id = $3`,
      `${cleanSlug}`,
      "published",
      client_author_id
    );
    console.timeEnd("Raw Way");
    if (post_[0]) {
      return { ...mapPostToGraphql(post_[0]), __typename: "Post" };
    }
    return {
      __typename: "NotFound",
      message: "Post was not found",
    };
  }

  return { __typename: "NotFound", message: "Post not found" };
};
