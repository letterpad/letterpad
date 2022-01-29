import { setResponsiveImages } from "./../utils/imageAttributs";
import { Op, Order } from "sequelize";
import {
  Permissions,
  PostFilters,
  PostStatusOptions,
  SortBy,
  PostTypes,
  QueryResolvers,
  NavigationType,
} from "@/__generated__/__types__";
import { decrypt } from "../utils/crypto";
import logger from "./../../shared/logger";
import debug from "debug";
import { mdToHtml } from "@/shared/converter";
import { ResolverContext } from "../context";
import { Prisma } from "@prisma/client";

type PostAttributes = any;

interface IPostCondition {
  conditions: {
    order: Order;
    include: any;
    where: {
      id?: number | {};
      featured?: boolean;
      status: { [Op.ne]: PostStatusOptions.Trashed };
      type?: PostTypes;
      author_id?: number;
    };
    limit: number;
    offset?: number;
    sortBy: "ASC" | "DESC";
  };
}

const Post = {
  slug: async ({ type, slug }: PostAttributes) => {
    return `/${type}/${slug}`;
  },
  cover_image: async ({
    cover_image,
    cover_image_width,
    cover_image_height,
  }: PostAttributes) => {
    if (cover_image && cover_image.startsWith("/")) {
      return process.env.ROOT_URL + cover_image;
    }
    return {
      src: cover_image,
      width: cover_image_width,
      height: cover_image_height,
    };
  },
  author: async (attrs: PostAttributes, _args, { prisma }: ResolverContext) => {
    const post = await prisma.post.findFirst({
      where: { id: attrs.id },
      include: { author: true },
    });
    if (post) {
      return post.author;
    }
  },
  tags: async ({ id }: PostAttributes, _args, { prisma }: ResolverContext) => {
    const tags = await prisma.tag.findMany({
      where: { posts: { some: { id } } },
    });
    return tags;
  },
  html: async ({ html }) => {
    return setResponsiveImages(html);
  },
};

const Query: QueryResolvers<ResolverContext> = {
  /**
   * Query to take care of multiple post in one page.
   * Used for Search and Admin posts and pages list.
   */
  async posts(_parent, args, { session, author_id, prisma }, _info) {
    let authorId = session?.user.id || author_id;
    if (!authorId) {
      return { __typename: "PostError", message: "Author Id not found" };
    }

    // First verify if posts are requested from client and not admin dashboard.
    // If posts are requested by client, then verify if this a collection of posts for
    // displaying in homepage.

    // find the real slug of the tag
    try {
      if (args.filters?.tagSlug === "/") {
        // find the first menu item. If its a tag, then display its collection of posts.
        const authorWithSetting = await prisma.author.findFirst({
          where: { id: author_id },
          include: { setting: true },
        });
        if (authorWithSetting?.setting.menu) {
          const menu = JSON.parse(authorWithSetting?.setting.menu);
          if (menu[0].type === NavigationType.Tag) {
            args.filters.tagSlug = menu[0].slug;
          }
        }
      }

      const skip =
        args.filters?.page && args.filters?.limit
          ? args.filters?.page * args.filters?.limit
          : 0;

      const condition: Prisma.PostFindManyArgs = {
        where: {
          author_id,
          id: args.filters?.id,
          featured: args.filters?.featured,
          status: args.filters?.status,
          slug: args.filters?.slug,
          type: args.filters?.type || PostTypes.Post,
          tags: {
            some: {
              slug: args.filters?.tagSlug,
            },
          },
        },
        take: args.filters?.limit || 10,
        skip,
        orderBy: {
          updatedAt: args?.filters?.sortBy || "desc",
        },
      };
      const posts = await prisma.post.findMany(condition);

      return {
        __typename: "PostsNode",
        rows: posts,
        count: await prisma.post.count({ where: condition.where }),
      };
    } catch (e) {
      return { __typename: "PostError", message: e.message };
    }
  },

  async post(_parent, args, { session, author_id, models }, _info) {
    const error = { __typename: "PostError", message: "" };
    if (!args.filters) return { ...error, message: "Missing arguments" };

    const authorId = session?.user.id || author_id;

    if (!authorId) {
      return { ...error, message: "No author found for this post." };
    }
    const { previewHash, ...filters } = args.filters;
    const conditions = {
      where: { ...filters, author_id: authorId } as PostFilters & {
        author_id?: number;
      },
    };
    if (session?.user.permissions) {
      //  Author should not see others posts from admin panel
      if (session.user.permissions.includes(Permissions.ManageOwnPosts)) {
        conditions.where.author_id = session.user.id;
      }
    }

    if (!session?.user.id) {
      conditions.where.status = PostStatusOptions.Published;
    }

    if (args.filters.id) {
      conditions.where.id = args.filters.id;
    }

    if (args.filters.slug) {
      conditions.where.slug = args.filters.slug.split("/").pop();
    }

    if (previewHash) {
      conditions.where.id = Number(decrypt(previewHash));
      delete conditions.where.status;
    }
    const postRow = await models.Post.findOne(conditions);
    const post = postRow?.get();
    if (post) {
      const html = previewHash
        ? mdToHtml(post.html_draft || post.html)
        : post.html;

      return { ...post, html, __typename: "Post" };
    }
    return { ...error, message: "Post not found" };
  },

  async stats(_, _args, { session, models }) {
    logger.debug("Reached resolver: stats");
    const result = {
      posts: { published: 0, drafts: 0 },
      pages: { published: 0, drafts: 0 },
      tags: 0,
      media: 0,
    };
    const author_id = session?.user.id;

    if (!author_id) {
      return {
        __typename: "StatsError",
        message: "Couldnt find author in session",
      };
    }

    const author = await models.Author.findOne({ where: { id: author_id } });

    if (!author) {
      return {
        __typename: "StatsError",
        message: "Couldnt find author",
      };
    }

    result.posts.published = await author.countPosts({
      where: {
        status: PostStatusOptions.Published,
        type: PostTypes.Post,
      },
    });

    result.posts.drafts = await author.countPosts({
      where: {
        status: PostStatusOptions.Draft,
        type: PostTypes.Post,
      },
    });

    result.pages.published = await author.countPosts({
      where: {
        status: PostStatusOptions.Published,
        type: PostTypes.Page,
      },
    });

    result.pages.drafts = await author.countPosts({
      where: {
        status: PostStatusOptions.Draft,
        type: PostTypes.Page,
      },
    });

    result.tags = await author.countTags();

    result.media = await author.countUploads();

    return {
      __typename: "Stats",
      ...result,
    };
  },
};

export default { Query, Post };
