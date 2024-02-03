import { Prisma } from "@prisma/client";
import { au } from "@upstash/redis/zmscore-a4ec4c2a";

import {
  AuthorResolvers,
  MutationResolvers,
  NotificationMeta,
  PostStatusOptions,
  PostTypes,
  QueryResolvers,
} from "@/__generated__/__types__";
import { ResolverContext } from "@/graphql/context";

import { getSocialLink } from "./helpers";
import { convertNotificationMetaIn } from "./utils/dbTypeCheck";
import { enqueueEmailAndSend } from "../mail/enqueueEmailAndSend";
import {
  createAuthor,
  forgotPassword,
  getAuthor,
  getPermissionFromAuthor,
  getRoleFromAuthor,
  resetPassword,
  updateAuthor,
} from "../services/author";
import { loginAuthor } from "../services/author/loginAuthor";
import { EmailTemplates } from "../types";

const Author: AuthorResolvers<ResolverContext> = {
  role: async ({ id }, _args, context) => getRoleFromAuthor(id, context),
  permissions: async ({ id }, _args, context) =>
    getPermissionFromAuthor(id, context),
  social: ({ social = {} }) => {
    if (typeof social === "string") {
      return getSocialLink(JSON.parse(social));
    }
    return social;
  },
  followers: async ({ id }, _args, { prisma }) => {
    const followers = await prisma.follows.findMany({
      where: {
        follower: {
          id,
        },
      },
    });
    const ids = followers.map((user) => user.follower_id);
    const rows = await prisma.author.findMany({
      where: {
        id: {
          in: ids,
        },
      },
    });

    return Promise.resolve(
      rows.map((row) => ({
        ...row,
        createdAt: row.createdAt?.toISOString(),
      }))
    );
  },
  following: async ({ id }, _args, { prisma }) => {
    const following = await prisma.follows.findMany({
      where: {
        following: {
          id,
        },
      },
    });
    const ids = following.map((user) => user.following_id);
    const rows = await prisma.author.findMany({
      where: {
        id: {
          in: ids,
        },
      },
    });

    return Promise.resolve(
      rows.map((row) => ({
        ...row,
        createdAt: row.createdAt?.toISOString(),
      }))
    );
  },
};

const Query: QueryResolvers<ResolverContext> = {
  async me(_parent, _args, context) {
    return getAuthor(_args, context);
  },
  async aboutStats(_parent, { username }, { prisma }) {
    const author = await prisma.author.findFirst({
      where: { username },
      include: {
        followers: true,
        following: true,
      },
    });
    const feed = await prisma.post.findMany({
      where: {
        author: {
          username,
        },
        status: PostStatusOptions.Published,
      },
    });
    const postCount = feed.filter((row) => row.type === PostTypes.Post).length;

    return {
      stats: {
        followerCount: author?.followers.length || 0,
        followingCount: author?.following.length || 0,
        postCount,
      },
      ok: true,
    };
  },
  async isFollowing(_parent, { username }, { prisma, session }) {
    if (!session?.user?.id) return { following: false, ok: false };
    const a = await prisma.author.findFirst({ where: { username } });
    const b = await prisma.follows.findFirst({
      where: {
        follower: {
          id: Number(session?.user?.id),
        },
        following: {
          id: Number(a?.id),
        },
      },
    });

    return {
      following: !!b,
      ok: true,
    };
  },
};

const Mutation: MutationResolvers<ResolverContext> = {
  async createAuthor(_, args, context) {
    return createAuthor(args, context);
  },
  async login(_parent, args, context) {
    return loginAuthor(args, context);
  },
  async updateAuthor(_root, args, context) {
    return updateAuthor(args, context);
  },
  async forgotPassword(_root, args, context) {
    return forgotPassword(args, context);
  },
  async resetPassword(_root, args, context) {
    return resetPassword(args, context);
  },
  async followAuthor(_root, { username }, { prisma, session }) {
    if (!session?.user?.id)
      return { ok: false, message: "You are not logged in" };

    const author = await prisma.author.findFirst({
      where: { username },
      select: { id: true },
    });

    if (!author?.id) return { ok: false, message: "Author not found" };

    await prisma.follows.create({
      data: {
        follower: {
          connect: {
            id: session.user.id,
          },
        },
        following: {
          connect: {
            id: author.id,
          },
        },
      },
    });

    await prisma.notifications.create({
      data: {
        author_id: author.id,
        meta: convertNotificationMetaIn({
          __typename: "FollowerNewMeta",
          follower_avatar: session.user.avatar,
          follower_name: session.user.username,
          follower_username: session.user.username,
          follower_id: session.user.id,
        }),
      },
    });

    await enqueueEmailAndSend({
      template_id: EmailTemplates.NewFollower,
      follower_id: session.user.id,
      following_id: author.id,
    });
    return {
      ok: true,
      message: "You are now following this author",
    };
  },
  async unFollowAuthor(_root, { username }, { prisma, session }) {
    const author = await prisma.author.findFirst({
      where: { username },
      select: { id: true },
    });
    if (session?.user?.id && author?.id) {
      await prisma.follows.delete({
        where: {
          follower_id_following_id: {
            follower_id: session.user.id,
            following_id: author.id,
          },
        },
      });
      return {
        ok: true,
        message: "You are now following this author",
      };
    }
    return {
      ok: false,
      message: "You are not logged in",
    };
  },
  async deleteAuthor(_root, _args, { prisma, session }) {
    if (session?.user.id) {
      await prisma.author.delete({
        where: { id: session.user.id },
      });
      return {
        ok: true,
      };
    }
    return {
      ok: false,
      message: "You are not logged in",
    };
  },
};

export default { Mutation, Author, Query };
