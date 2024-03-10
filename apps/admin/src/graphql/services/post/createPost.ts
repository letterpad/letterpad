import { Prisma } from "@prisma/client";

import { report } from "@/components/error";

import {
  MutationCreatePostArgs,
  PostTypes,
  ResolversTypes,
} from "@/__generated__/__types__";
import { ResolverContext } from "@/graphql/context";
import { mapPostToGraphql } from "@/graphql/resolvers/mapper";
import { getOrCreateSlug } from "@/graphql/resolvers/utils/getOrCreateSlug";

export const createPost = async (
  args: MutationCreatePostArgs,
  { prisma, session }: ResolverContext
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
  const dataToUpdate: Prisma.PostCreateInput = {
    html: args.data.html || "",
    page_data: JSON.stringify({ rows: [] }),
  };

  if (args.data.title) {
    dataToUpdate.title = args.data.title.trim();
  }
  if (args.data.sub_title) {
    dataToUpdate.title = args.data.sub_title.trim();
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
  if (args.data.page_type) {
    dataToUpdate.page_type = args.data.page_type;
  }
  if (args.data.page_data) {
    dataToUpdate.page_data = args.data.page_data;
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
      newPost.id,
      slug,
      args.data.title
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
  } catch (e: any) {
    report.error(e);
  }
  return {
    __typename: "PostError",
    message: "Unable to create post",
  };
};
