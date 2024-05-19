import { Prisma } from "@prisma/client";
import {
  MutationUpdatePostArgs,
  PostStatusOptions,
  PostTypes,
  Role,
  UpdatePostResponse,
} from "letterpad-graphql";
import { revalidateTag } from "next/cache";

import { mail } from "@/lib/mail";

import { report } from "@/components/error";

import { ResolverContext } from "@/graphql/context";
import { slugify } from "@/graphql/resolvers/helpers";
import { mapPostToGraphql } from "@/graphql/resolvers/mapper";
import { convertNotificationMetaIn } from "@/graphql/resolvers/utils/dbTypeCheck";
import { formatHtml } from "@/graphql/resolvers/utils/formatHtml";
import { getCoverImageAttrs } from "@/graphql/resolvers/utils/getImageAttrs";
import { updateMenuOnTitleChange } from "@/graphql/resolvers/utils/updateMenuOnTitleChange";
import { submitSitemap } from "@/shared/submitSitemap";
import { textToSlug } from "@/utils/slug";

export const updatePost = async (
  args: MutationUpdatePostArgs,
  { prisma, session }: ResolverContext
): Promise<UpdatePostResponse> => {
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
      include: {
        tags: true,
      },
    });

    if (!existingPost) {
      return {
        __typename: "PostError",
        message: "Current post not found to update",
      };
    }
    const isAdmin = session.user.role === Role.Admin;

    const isFirstPublish =
      args.data.status === PostStatusOptions.Published &&
      existingPost.status !== PostStatusOptions.Published;

    const nowPublished = args.data.status === PostStatusOptions.Published;

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
    const isBanned = isAdmin && typeof args.data.banned !== "undefined";
    if (isBanned) {
      await prisma.post.update({
        data: { banned: args.data.banned! },
        where: { id: args.data.id },
      });
      revalidateTag("letterpadLatestPosts");
      return {
        ...mapPostToGraphql({ ...existingPost, banned: args.data.banned! }),
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
      newPostArgs.data.featured = args.data.featured!;
    }
    if (args.data.type) {
      newPostArgs.data.type = args.data.type;
    }
    if (typeof args.data.exclude_from_home !== "undefined") {
      newPostArgs.data.exclude_from_home = args.data.exclude_from_home!;
    }
    if (args.data.mail_status) {
      newPostArgs.data.mail_status = args.data.mail_status;
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
        textToSlug(args.data.slug.split("/").pop() ?? ""),
        existingPost.author_id,
        existingPost.id
      );
    }
    if (args.data.title && existingPost.slug.includes("untitled")) {
      newPostArgs.data.slug = await slugify(
        textToSlug(args.data.title.trim()),
        existingPost.author_id,
        existingPost.id
      );
    }
    if (args.data.createdAt) {
      if (new Date(args.data.createdAt) > new Date()) {
        return {
          __typename: "PostError",
          message: "You cannot set a future date",
        };
      }
      newPostArgs.data.createdAt = args.data.createdAt;
    }
    if (args.data.publishedAt) {
      if (new Date(args.data.publishedAt) > new Date()) {
        return {
          __typename: "PostError",
          message: "You cannot set a future date",
        };
      }
      const post = await prisma.post.findFirst({
        where: { id: args.data.id },
      });
      if (post == null) {
        return {
          __typename: "PostError",
          message: "Post not found",
        };
      }
      if (post.createdAt && post.createdAt > new Date(args.data.publishedAt)) {
        return {
          __typename: "PostError",
          message: "Published date cannot be before the created date",
        };
      }
      newPostArgs.data.publishedAt = args.data.publishedAt;
    }

    if (args.data.html_draft) {
      newPostArgs.data.html_draft = args.data.html_draft;
      newPostArgs.data.reading_time =
        Math.ceil((args.data.stats?.words ?? 200) / 200) + "" ?? "2";
    }

    if (nowPublished) {
      newPostArgs.data.html = await formatHtml(existingPost.html_draft ?? "");
    }

    if (isFirstPublish) {
      newPostArgs.data.publishedAt = new Date();
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

    if (nowPublished) {
      revalidateTag("letterpadLatestPosts");
      revalidateTag("categories");
    }
    if (!author.first_post_published && nowPublished) {
      await prisma.author.update({
        data: { first_post_published: true },
        where: { id: author.id },
      });
    }

    // update content

    if (updatedPost) {
      await updateMenuOnTitleChange({
        authorId: session.user.id,
        isPage: updatedPost.type === PostTypes.Page,
        prevOriginalName: existingPost.title,
        originalName: updatedPost.title,
        slug: updatedPost.slug,
      });

      if (isFirstPublish) {
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

    if (isFirstPublish) {
      const followers = await prisma.follows.findMany({
        where: {
          following_id: session.user.id,
        },
      });

      await Promise.all(
        followers.map((follower) => {
          return prisma.notifications.create({
            data: {
              author_id: follower.follower_id,
              meta: convertNotificationMetaIn({
                __typename: "PostNewMeta",
                author_avatar: session.user.avatar,
                author_name: session.user.username,
                author_username: session.user.username,
                post_id: existingPost.id,
                post_slug: existingPost.slug,
                post_title: existingPost.title,
              }),
            },
          });
        })
      );

      try {
        await mail(
          {
            from: `"Letterpad" <admin@letterpad.app>`,
            replyTo: `"Admin" <admin@letterpad.app>`,
            to: `admin@letterpad.app`,
            subject: `New post published - ${existingPost.title}`,
            html: `<p>Hi,</p><p>A new post has been published on your blog. <a href="https://${session.user.username}.letterpad.app/post/${existingPost.slug}">Click here</a> to view the post.</p><p>Regards,<br/>Letterpad</p>`,
          },
          false
        );
      } catch (e) {
        // eslint-disable-next-line no-console
        console.log(e);
      }
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
