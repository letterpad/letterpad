import {
  MutationResolvers,
  PostResolvers,
  QueryResolvers,
} from "letterpad-graphql";
import { fieldsMap } from 'graphql-fields-list';
import { report } from "@/components/error";
import { ResolverContext } from "@/graphql/context";
import { getRootUrl } from "@/shared/getRootUrl";
import { createPathWithPrefix } from "@/utils/slug";

import { convertNotificationMetaIn } from "./utils/dbTypeCheck";
import {
  createPost,
  getAuthorFromPost,
  getPost,
  getPosts,
  getTagsFromPost,
  updatePost,
} from "../services/post";
import { getLetterpadFeaturedPosts } from "../services/post/getLetterpadFeaturedPosts";
import { getLetterpadLatestPost } from "../services/post/getLetterpadLatestPost";
import { getLetterpadLatestPosts } from "../services/post/getLetterpadLatestPosts";
import { getLetterpadTrendingPosts } from "../services/post/getLetterpadTrendingPosts";
import { getRelatedPosts } from "../services/post/getRelatedPosts";
import { getStats } from "../services/stats";
import { setResponsiveImages } from "../utils/imageAttributs";

type PostAttributes = any;

const Post: PostResolvers<ResolverContext> = {
  slug: async ({ type, slug }) => {
    return createPathWithPrefix(slug ?? "", type);
  },
  cover_image: async ({
    cover_image,
    cover_image_width,
    cover_image_height,
  }: PostAttributes) => {
    const baseUrl = cover_image.startsWith("/") ? getRootUrl() : "";
    return {
      src: baseUrl + cover_image,
      width: cover_image_width,
      height: cover_image_height,
    };
  },

  title: async ({ title }) => {
    return title?.length ? title : "Untitled";
  },
  featured: async (attrs, _args, { dataloaders }) => {
    const isFeatured = await dataloaders.batchFeatured.load(attrs.id);
    return !!isFeatured;
  },
  author: async (attrs, _args, context) => {
    return getAuthorFromPost(attrs['author_id'], context);
  },
  tags: async ({ id }, _args, context) => {
    return getTagsFromPost(id, context);
  },
  html: async ({ html }) => {
    return html ? setResponsiveImages(html) : "";
  },
  html_draft: async ({ html_draft }) => {
    return html_draft ? setResponsiveImages(html_draft) : "";
  },
  stats: async ({ stats, reading_time }) => {
    const oldReadingTime = reading_time ? parseInt(reading_time || "") : 2;
    if (stats && typeof stats === "string") {
      const newStats = JSON.parse(stats);
      const newReadingTime = Math.ceil((newStats.words ?? 0) / 200);
      return {
        ...newStats,
        reading_time:
          (newStats.words ? newReadingTime : oldReadingTime) + " mins",
      };
    }
    return { reading_time: oldReadingTime };
  },
  likes: async ({ id }, _, { dataloaders }) => {
    const likes = await dataloaders.likes.load(id);
    return likes;
  },
};

const Query: QueryResolvers<ResolverContext> = {
  async letterpadFeaturedPosts(_parent, args, context) {
    try {
      const response = await getLetterpadFeaturedPosts(args, context);
      return response;
    } catch (e: any) {
      report.error(e);
      return {
        __typename: "Exception",
        message: "Something unexpected happened",
      };
    }
  },
  async letterpadTrendingPosts(_parent, args, context) {
    try {
      const response = await getLetterpadTrendingPosts(args, context);
      return response;
    } catch (e: any) {
      report.error(e);
      return {
        __typename: "Exception",
        message: "Something unexpected happened",
      };
    }
  },
  async letterpadLatestPost(_parent, args, context) {
    try {
      const response = await getLetterpadLatestPost(args, context);
      return response;
    } catch (e: any) {
      report.error(e);
      return {
        __typename: "Exception",
        message: "Something unexpected happened",
      };
    }
  },
  async letterpadLatestPosts(_parent, args, context) {
    try {
      const response = await getLetterpadLatestPosts(args, context);
      return response;
    } catch (e: any) {
      report.error(e);
      return {
        __typename: "Exception",
        message: "Something unexpected happened",
      };
    }
  },
  async relatedPosts(_parent, args, context) {
    try {
      const response = await getRelatedPosts(args, context);
      return response;
    } catch (e: any) {
      report.error(e);
      return {
        __typename: "Exception",
        message: "Something unexpected happened",
      };
    }
  },
  async posts(_parent, args, context, info) {
    try {
      // Extract requested fields from info
      const fields = fieldsMap(info);
      const response = await getPosts(args, context, fields);
      const { session, prisma } = context;
      if (session?.user.id) {
        await prisma.author.update({
          data: { last_seen: new Date() },
          where: { id: session.user.id },
        });
      }
      return response;
    } catch (e: any) {
      report.error(e);
      return {
        __typename: "Exception",
        message: "Something unexpected happened",
      };
    }
  },

  async post(_parent, args, context, info) {
    try {
      const fields = fieldsMap(info)
      const response = await getPost(args, context, fields);
      return response;
    } catch (e: any) {
      report.error(e);
      return {
        __typename: "Exception",
        message: "Something unexpected happened.",
      };
    }
  },

  async isPostLiked(_, args, { prisma, session }) {
    if (!session?.user.id) {
      return {
        ok: false,
        liked: false,
        message: "You need to be logged in to like a post",
      };
    }
    const row = await prisma.likes.findFirst({
      where: {
        liked_by: session.user.id,
        post_id: args.postId,
      },
    });

    return {
      ok: true,
      liked: !!row,
    };
  },
  async stats(_, args, context) {
    return getStats(args, context);
  },
};

const Mutation: MutationResolvers<ResolverContext> = {
  async createPost(_parent, args, context) {
    try {
      const response = await createPost(args, context);
      return response;
    } catch (e: any) {
      report.error(e);
      return {
        __typename: "PostError",
        message: "Something unexpected happened.",
      };
    }
  },

  async updatePost(_parent, args, context) {
    try {
      const response = await updatePost(args, context);
      return response;
    } catch (e: any) {
      report.error(e);
      return {
        __typename: "PostError",
        message: "Something unexpected happened.",
      };
    }
  },

  async likePost(_parent, args, { prisma, session }) {
    if (!session?.user.id) {
      return {
        message: "You need to be logged in to like a post",
        ok: false,
      };
    }
    try {
      const record = await prisma.likes.findFirst({
        where: {
          post_id: args.postId,
          liked_by: session.user.id,
        },
      });

      if (record) {
        return {
          message: "You have already liked this post",
          ok: false,
        };
      }

      await prisma.likes.create({
        data: {
          post: {
            connect: {
              id: args.postId,
            },
          },
          author: {
            connect: {
              id: session.user.id,
            },
          },
        },
      });

      const post = await prisma.post.findFirst({
        where: {
          id: args.postId,
        },
        select: {
          author_id: true,
          slug: true,
        },
      });

      await prisma.notifications.create({
        data: {
          author_id: post?.author_id!,
          meta: convertNotificationMetaIn({
            __typename: "PostLikeMeta",
            author_avatar: session.user.avatar,
            author_name: session.user.username,
            author_username: session.user.username,
            post_id: args.postId,
            post_slug: post?.slug,
          }),
        },
      });

      return {
        ok: true,
        message: `Post Liked`,
      };
    } catch (e: any) {
      return {
        message: e.message,
        ok: false,
      };
    }
  },
  async unLikePost(_parent, args, { prisma, session }) {
    if (!session?.user.id) {
      return {
        message: "You need to be logged in to like a post",
        ok: false,
      };
    }
    try {
      await prisma.likes.delete({
        where: {
          post_id_liked_by: {
            post_id: args.postId,
            liked_by: session.user.id,
          },
        },
      });
      return {
        ok: true,
        message: "Post like removed",
      };
    } catch (e: any) {
      return {
        message: e.message,
        ok: false,
      };
    }
  },
};

export default { Mutation, Post, Query };