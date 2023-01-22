import { Prisma } from "@prisma/client";

import { report } from "@/components/error";

import {
  MutationUpdatePostArgs,
  PostStatusOptions,
  PostTypes,
  ResolversTypes,
} from "@/__generated__/__types__";
import { ResolverContext } from "@/graphql/context";
import { getReadingTimeFromHtml, slugify } from "@/graphql/resolvers/helpers";
import { mapPostToGraphql } from "@/graphql/resolvers/mapper";
import { formatHtml } from "@/graphql/resolvers/utils/formatHtml";
import { getCoverImageAttrs } from "@/graphql/resolvers/utils/getImageAttrs";
import { updateMenuOnTitleChange } from "@/graphql/resolvers/utils/updateMenuOnTitleChange";
import { submitSitemap } from "@/shared/submitSitemap";
import { textToSlug } from "@/utils/slug";

export const updatePost = async (
  args: MutationUpdatePostArgs,
  { prisma, session }: ResolverContext
): Promise<ResolversTypes["UpdatePostResponse"]> => {
  if (!session?.user.id) {
    return {
      __typename: "PostError",
      message: "Authentication failed",
    };
  }
  try {
    if (!args.data) {
      return {
        __typename: "PostError",
        message: "No arguments to create a post",
      };
    }
    const existingPost = await prisma.post.findFirst({
      where: { id: args.data.id },
    });

    if (!existingPost) {
      return {
        __typename: "PostError",
        message: "Current post not found to update",
      };
    }

    const author = await prisma.author.findFirst({
      where: { id: existingPost.author_id },
    });
    if (!author) {
      return {
        __typename: "PostError",
        message: "No Author found",
      };
    }

    const newPostArgs: Prisma.PostUpdateArgs = {
      data: {},
      where: {
        id: args.data.id,
      },
    };
    if (
      args.data.status === PostStatusOptions.Trashed &&
      existingPost.status === PostStatusOptions.Trashed
    ) {
      // permanently delete the post
      await prisma.post.delete({
        where: { id: args.data.id },
      });
      return {
        __typename: "PostTrashed",
        message: "Post deleted successfully",
      };
    }

    if (args.data.title?.trim() || args.data.title === "") {
      newPostArgs.data.title = args.data.title.trim();
    }
    if (args.data.sub_title?.trim() || args.data.sub_title === "") {
      newPostArgs.data.sub_title = args.data.sub_title.trim();
    }
    if (args.data.excerpt?.trim() || args.data.excerpt === "") {
      newPostArgs.data.excerpt = args.data.excerpt.trim();
    }
    if (args.data.status) {
      newPostArgs.data.status = args.data.status;
    }
    if (typeof args.data.featured !== "undefined") {
      newPostArgs.data.featured = args.data.featured;
    }
    if (args.data.type) {
      newPostArgs.data.type = args.data.type;
    }
    if (args.data.page_type) {
      newPostArgs.data.page_type = args.data.page_type;
    }
    if (args.data.page_data) {
      newPostArgs.data.page_data = args.data.page_data;
    }
    if (args.data.cover_image) {
      const img = await getCoverImageAttrs(args.data.cover_image);
      newPostArgs.data.cover_image = img.cover_image;
      newPostArgs.data.cover_image_width = img.cover_image_width;
      newPostArgs.data.cover_image_height = img.cover_image_height;
    }
    if (args.data.stats) {
      newPostArgs.data.stats = JSON.stringify({
        ...args.data.stats,
      });
    }
    if (args.data.slug) {
      newPostArgs.data.slug = await slugify(
        prisma.post,
        textToSlug(args.data.slug.split("/").pop() ?? ""),
        existingPost.author_id
      );
    }
    if (args.data.title && existingPost.slug.includes("untitled")) {
      newPostArgs.data.slug = await slugify(
        prisma.post,
        textToSlug(args.data.title.trim()),
        existingPost.author_id
      );
    }

    if (args.data.html || args.data.html === "") {
      newPostArgs.data.html = await formatHtml(args.data.html);
      newPostArgs.data.reading_time = getReadingTimeFromHtml(
        newPostArgs.data.html
      );
    }
    if (args.data.html_draft || args.data.html_draft === "") {
      newPostArgs.data.html_draft = await formatHtml(args.data.html_draft);
    }

    if (args.data.status === PostStatusOptions.Published) {
      newPostArgs.data.html = existingPost.html_draft || "";
      newPostArgs.data.publishedAt = new Date();
    }
    if (args.data.status === PostStatusOptions.Draft) {
      newPostArgs.data.html_draft = existingPost.html || "";
    }
    newPostArgs.data.updatedAt = new Date();
    if (args.data.tags) {
      newPostArgs.data.tags = {
        set: [],
        connectOrCreate: args.data.tags.map(({ name, slug }) => {
          return {
            create: { name, slug },
            where: { name },
          };
        }),
      };
    }
    const updatedPost = await prisma.post.update(newPostArgs);

    const nowPublished = args.data.status === PostStatusOptions.Published;
    if (!author.first_post_published && nowPublished) {
      await prisma.author.update({
        data: { first_post_published: true },
        where: { id: author.id },
      });
    }

    // update content

    if (updatedPost) {
      await updateMenuOnTitleChange({
        Author: prisma.author,
        authorId: session.user.id,
        isPage: updatedPost.type === PostTypes.Page,
        prevOriginalName: existingPost.title,
        originalName: updatedPost.title,
        slug: updatedPost.slug,
      });

      if (newPostArgs.data.status === PostStatusOptions.Published) {
        const url = `https://${session.user.username}.letterpad.app/sitemap.xml`;
        submitSitemap(url);
      }
    }

    if (!updatedPost) {
      return {
        __typename: "PostError",
        message: "Updated post not found",
      };
    }

    return {
      ...mapPostToGraphql(updatedPost),
    };
  } catch (e: any) {
    report.error(e);
    return {
      __typename: "PostError",
      message: e.message,
    };
  }
};
