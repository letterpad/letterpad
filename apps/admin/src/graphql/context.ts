/* eslint-disable no-console */
import { Author, Post, Setting, Tag } from "@prisma/client";
import DataLoader from "dataloader";
import { Like } from "letterpad-graphql";
import { getServerSession as getServerSession1 } from "next-auth";
import { andThen, pipe } from "ramda";

import { prisma } from "@/lib/prisma";

import { SessionData } from "./types";
import { options } from "../pages/api/auth/[...nextauth]";
import {
  findAuthorIdFromCustomDomain,
  findAuthorIdFromLetterpadSubdomain,
  findEmailFromToken,
} from "../shared/getAuthorIdFromHeaders";
import { getHeader } from "../utils/headers";

const isTest = process.env.NODE_ENV === "test";

const cache: Record<string, string> = {};

export const getResolverContext = async (request: Request) => {
  const authHeader = getHeader(request.headers, "authorization");
  const identifierHeader = getHeader(request.headers, "identifier");
  if (cache[`${authHeader}-${identifierHeader}`]) {
    console.log(
      `Found authorId from cache: ${cache[`${authHeader}-${identifierHeader}`]}`
    );

    return {
      client_author_id: cache[`${authHeader}-${identifierHeader}`],
      session: null,
    };
  }

  let { authorId } = await pipe(
    findEmailFromToken,
    andThen(findAuthorIdFromLetterpadSubdomain),
    andThen(findAuthorIdFromCustomDomain)
  )({ authHeader, identifierHeader, authorId: null });

  if (authorId) {
    console.log(`Found author id from header: ${authorId}`);
    cache[`${authHeader}-${identifierHeader}`] = authorId;
  }

  if (!authorId && !isTest) {
    const session = (await getServerSession()) as unknown as {
      user: SessionData;
    };
    if (session?.user?.id) {
      return { session };
    }
  }
  return { client_author_id: authorId, session: null };
};

const batchAuthors = async (keys: readonly string[]) => {
  const authors = await prisma?.author.findMany({
    where: { id: { in: [...keys] } },
    include: {
      setting: {
        select: {
          site_url: true,
        },
      },
      membership: {
        select: {
          status: true,
        },
      },
    },
  });

  const authorMap: Record<string, (typeof authors)[0]> = {};

  authors?.forEach((author) => {
    authorMap[author.id] = author;
  });
  return keys.map((key) => authorMap[key]);
};

const batchSettings = async (keys: readonly string[]) => {
  const settings = await prisma?.setting.findMany({
    where: {
      author: {
        id: { in: [...keys] },
      },
    },
  });

  const settingsMap: Record<string, (typeof settings)[0]> = {};

  settings?.forEach((setting) => {
    settingsMap[setting.author_id] = setting;
  });

  return keys.map((key) => settingsMap[key]);
};

const batchPosts = async (keys: readonly string[], fields: (keyof Post)[]) => {
  const posts = await prisma?.post.findMany({
    where: {
      id: { in: [...keys] },
    },
    select: fields.reduce(
      (acc, key) => {
        acc[key] = true;
        return acc;
      },
      { title: true, id: true, author_id: true, type: true }
    ),
  });
  const postsMap: Record<string, (typeof posts)[0]> = {};

  posts?.forEach((post) => {
    postsMap[post.id] = post;
  });

  return keys.map((key) => postsMap[key]);
};
const batchLikes = async (keys: readonly string[]) => {
  const result = await prisma.likes.findMany({
    select: {
      post_id: true,
      author: {
        select: {
          avatar: true,
          username: true,
        },
      },
    },
    where: {
      post: {
        id: { in: [...keys] },
      },
    },
  });
  const likesMap: Record<string, { avatar: string; username: string }[]> = {};

  result.forEach((row) => {
    if (!likesMap[row.post_id]) {
      likesMap[row.post_id] = [];
    }
    likesMap[row.post_id].push({
      avatar: row.author.avatar!,
      username: row.author.username!,
    });
  });
  return keys.map((key) => likesMap[key] ?? []);
};
const batchTags = async (keys: readonly string[]) => {
  const tags = await prisma.tag.findMany({
    where: {
      posts: {
        some: { id: { in: [...keys] } },
      },
    },
    select: {
      name: true,
      slug: true,
      likes: true,
      views: true,
      posts: {
        select: {
          id: true,
        },
      },
    },
  });

  const postTags = [] as Record<string, (typeof tags)[0][]>[];

  tags.forEach((tag) => {
    tag.posts.forEach((post) => {
      if (!postTags[post.id]) {
        postTags[post.id] = [];
      }
      postTags[post.id].push(tag);
    });
  });

  return keys.map((key) => postTags[key] ?? []);
};
const batchFeatured = async (keys: readonly string[]) => {
  const featured = await prisma.featuredWeek.findMany({
    where: {
      post_id: {
        in: [...keys],
      },
    },
  });
  const featuredPosts = {} as Record<string, boolean>;
  featured.forEach((post) => {
    if (!featuredPosts[post.id]) {
      featuredPosts[post.id] = true;
    }
  });
  return keys.map((key) => featuredPosts[key]);
};

const dataLoaderOptions = {
  batchScheduleFn: (callback) => setTimeout(callback, 20),
};

const createDataLoaders = () => ({
  author: new DataLoader<any, Author>(batchAuthors, dataLoaderOptions),
  likes: new DataLoader<any, Like[]>(batchLikes, dataLoaderOptions),
  setting: new DataLoader<any, Setting>(batchSettings, dataLoaderOptions),
  post: (fields: (keyof Partial<Post>)[]) =>
    new DataLoader<Readonly<string>, Partial<Post>>(
      (ids) => batchPosts(ids, fields),
      dataLoaderOptions
    ),
  tagsByPostId: new DataLoader<any, Tag[]>(batchTags, dataLoaderOptions),
  batchFeatured: new DataLoader<any, boolean>(batchFeatured, dataLoaderOptions),
});

export const context = async ({ request }) => {
  const resolverContext = await getResolverContext(request);

  return {
    ...resolverContext,
    prisma,
    dataloaders: createDataLoaders(),
  };
};

export type ResolverContext = Awaited<ReturnType<typeof context>>;

export const getServerSession = async () => {
  const session = await getServerSession1(options());
  return session;
};
