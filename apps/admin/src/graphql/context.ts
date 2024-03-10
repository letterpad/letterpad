/* eslint-disable no-console */
import { Author, Post, Setting, Tag } from "@prisma/client";
import DataLoader from "dataloader";
import { andThen, pipe } from "ramda";

import { prisma } from "@/lib/prisma";

import { SessionData } from "./types";
import { basePath } from "../constants";
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
    console.log(`Found author id from header: ${authorId}}`);
    cache[`${authHeader}-${identifierHeader}`] = authorId;
  }

  if (!authorId && !isTest) {
    const session = (await getServerSession({ req: request })) as unknown as {
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
    settingsMap[keys[0]] = setting;
  });

  return keys.map((key) => settingsMap[key]);
};

const batchPosts = async (keys: readonly string[]) => {
  const posts = await prisma?.post.findMany({
    where: {
      id: { in: [...keys] },
    },
    include: {
      featured_weeks: true,
    }
  });

  const postsMap: Record<string, (typeof posts)[0]> = {};

  posts?.forEach((post) => {
    postsMap[post.id] = post;
  });

  return keys.map((key) => postsMap[key]);
};
const batchTags = async (keys: readonly string[]) => {
  const tags = await prisma.tag.findMany({
    where: {
      posts: {
        some: { id: { in: [...keys] } },
      },
    },
    include: {
      posts: true,
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

const dataLoaderOptions = {
  batchScheduleFn: (callback) => setTimeout(callback, 20),
};
export const context = async ({ request }) => {
  const resolverContext = await getResolverContext(request);

  return {
    ...resolverContext,
    prisma,
    dataloaders: {
      author: new DataLoader<any, Author>(batchAuthors, dataLoaderOptions),
      setting: new DataLoader<any, Setting>(batchSettings, dataLoaderOptions),
      post: new DataLoader<Readonly<string>, Post>(
        batchPosts,
        dataLoaderOptions
      ),
      tagsByPostId: new DataLoader<any, Tag[]>(batchTags, dataLoaderOptions),
    },
  };
};

export type ResolverContext = Awaited<ReturnType<typeof context>>;

export const getServerSession = async ({ req }) => {
  try {
    const headers = req.headers;
    const sessionURL = process.env.ROOT_URL + basePath + "/api/auth/session";
    const res = await fetch(sessionURL, {
      headers: { cookie: getHeader(headers, "cookie") },
    });
    const session = await res.json();
    return session.user ? session as { user: SessionData } : null;
  } catch (e) {
    // eslint-disable-next-line no-console
  }
};
