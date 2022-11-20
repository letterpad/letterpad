import { report } from "@/components/error";

import { MutationResolvers } from "@/__generated__/__types__";
import { PostResolvers, QueryResolvers } from "@/__generated__/__types__";
import { ResolverContext } from "@/graphql/context";
import { createPathWithPrefix } from "@/utils/slug";

import { createPost, updatePost } from "../services/post";
import {
  getAuthorFromPost,
  getPost,
  getPosts,
  getTagsFromPost,
} from "../services/post";
import { getLetterpadLatestPost } from "../services/post/getLetterpadLatestPost";
import { getLetterpadLatestPosts } from "../services/post/getLetterpadLatestPosts";
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
    const baseUrl = cover_image.startsWith("/") ? process.env.ROOT_URL : "";
    return {
      src: baseUrl + cover_image,
      width: cover_image_width,
      height: cover_image_height,
    };
  },
  author: async (attrs, _args, context) => {
    return getAuthorFromPost(attrs.id, context);
  },
  tags: async ({ id }, _args, context) => {
    return getTagsFromPost(id, context);
  },
  html: async ({ html }) => {
    return html ? setResponsiveImages(html) : "";
  },
  stats: async ({ stats, reading_time }) => {
    const oldReadingTime = reading_time ? parseInt(reading_time || "") : 2;
    if (stats && typeof stats === "string") {
      const newStats = JSON.parse(stats);
      const newReadingTime = Math.ceil((newStats.words ?? 0) / 200);
      return {
        ...newStats,
        reading_time: newStats.words ? newReadingTime : oldReadingTime,
      };
    }
    return { reading_time: oldReadingTime };
  },
};

const Query: QueryResolvers<ResolverContext> = {
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
  async posts(_parent, args, context) {
    try {
      const response = await getPosts(args, context);
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

  async post(_parent, args, context) {
    try {
      const response = await getPost(args, context);
      return response;
    } catch (e: any) {
      report.error(e);
      return {
        __typename: "Exception",
        message: "Something unexpected happened.",
      };
    }
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

  async updatePost(_parent, args, { session, prisma }) {
    try {
      const response = await updatePost(args, { session, prisma });
      return response;
    } catch (e: any) {
      report.error(e);
      return {
        __typename: "PostError",
        message: "Something unexpected happened.",
      };
    }
  },
};

export default { Mutation, Post, Query };
