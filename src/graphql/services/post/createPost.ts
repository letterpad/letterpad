import { Prisma } from "@prisma/client";

import { report } from "@/components/error";

import {
  MutationCreatePostArgs,
  PostTypes,
  ResolversTypes,
} from "@/__generated__/__types__";
import siteConfig from "@/config/site.config";
import { ResolverContext } from "@/graphql/context";
import { mapPostToGraphql } from "@/graphql/resolvers/mapper";
import { getOrCreateSlug } from "@/graphql/resolvers/utils/getOrCreateSlug";

export const createPost = async (
  args: MutationCreatePostArgs,
  { prisma, session }: ResolverContext,
): Promise<ResolversTypes["CreatePostResponse"]> => {
  if (!args.data || !session?.user.id) {
    return {
      __typename: "PostError",
      message: "Session not found",
    };
  }

  const author = await prisma.author.findFirst({
    where: { id: session.user.id },
  });

  if (!author) {
    return {
      __typename: "PostError",
      message: "Author not found",
    };
  }
  const dataToUpdate: Prisma.PostCreateInput = { html: args.data.html || "" };

  if (args.data.title) {
    dataToUpdate.title = args.data.title.trim();
  }
  if (args.data.cover_image?.src) {
    dataToUpdate.cover_image = args.data.cover_image.src;
  }
  if (args.data.cover_image?.width) {
    dataToUpdate.cover_image = args.data.cover_image.width.toString();
  }
  if (args.data.cover_image?.height) {
    dataToUpdate.cover_image = args.data.cover_image.height.toString();
  }
  if (args.data.status) {
    dataToUpdate.status = args.data.status;
  }

  if (args.data.type) {
    dataToUpdate.type = args.data.type || PostTypes.Post;
  }

  // add default tag
  if (dataToUpdate.type === PostTypes.Post) {
    dataToUpdate.tags = {
      connectOrCreate: {
        create: {
          name: siteConfig.default_tag,
          slug: siteConfig.default_tag,
        },
        where: { name: siteConfig.default_tag },
      },
    };
  }
  const slug = args.data.slug;

  try {
    const newPost = await prisma.post.create({
      data: {
        ...dataToUpdate,
        author: {
          connect: { id: author.id },
        },
      },
    });

    const newSlug = await getOrCreateSlug(
      prisma.post,
      newPost.id,
      slug,
      args.data.title,
    );
    await prisma.post.update({
      data: { slug: newSlug },
      where: { id: newPost.id },
    });
    newPost.slug = newSlug;

    if (newPost) {
      return {
        ...mapPostToGraphql(newPost),
        title: args.data.title || "Untitled",
        __typename: "Post",
      };
    }
  } catch (e) {
    report.error(e);
  }
  return {
    __typename: "PostError",
    message: "Unable to create post",
  };
};
