import { Author, Post, Setting, Tag } from "@prisma/client";
import DataLoader from "dataloader";

import { prisma } from "@/lib/prisma";

import { SessionData } from "./types";
import { basePath } from "../constants";
import { getHeader } from "../utils/headers";
import { pipe, andThen } from "ramda"
import { findAuthorIdFromCustomDomain, findAuthorIdFromLetterpadSubdomain, findEmailFromToken } from "../shared/getAuthorIdFromHeaders";
import { decode } from "next-auth/jwt";
import { getAuthCookieName } from "../utils/authCookie";


const isTest = process.env.NODE_ENV === "test";

const cache = {};

export const getResolverContext = async (request: Request) => {
  const authHeader = getHeader(request.headers, "authorization");
  const identifierHeader = getHeader(request.headers, "identifier");

  if (cache[`${authHeader}-${identifierHeader}`]) {
    console.log(`Found author id from header cache: ${cache[`${authHeader}-${identifierHeader}`]}`);
    return { client_author_id: cache[`${authHeader}-${identifierHeader}`], session: null }
  }

  console.log(`AuthHeader: ${authHeader}, IdentifierHeader: ${identifierHeader}`);

  let { authorId } = await pipe(
    findEmailFromToken,
    andThen(findAuthorIdFromLetterpadSubdomain),
    andThen(findAuthorIdFromCustomDomain))
    ({ authHeader, identifierHeader, authorId: null });

  if (authorId) {
    console.log(`Found author id from header: ${authorId}}`);
    cache[`${authHeader}-${identifierHeader}`] = authorId;
  }

  if (!authorId && !isTest) {
    const session = await getServerSession({ req: request }) as unknown as {
      user: SessionData;
    };
    if (session?.user?.id) {
      console.log(`Found author id from session: ${session.user.id}}`);
      return { session }
    }
  }
  return { client_author_id: authorId, session: null }
};

const batchAuthors = async (keys) => {
  const authors = await prisma?.author.findMany({
    where: { id: { in: keys } },
  });

  const authorMap = {};

  authors?.forEach((author) => {
    authorMap[author.id] = author;
  });
  return keys.map((key) => authorMap[key]);
};

const batchSettings = async (keys) => {
  const settings = await prisma?.setting.findMany({
    where: {
      author: {
        id: { in: keys },
      },
    },
  });

  const settingsMap = {};

  settings?.forEach((setting) => {
    settingsMap[keys[0]] = setting;
  });

  return keys.map((key) => settingsMap[key]);
};

const batchPosts = async (keys) => {
  const posts = await prisma?.post.findMany({
    where: {
      id: { in: keys },
    },
  });

  const postsMap = {};

  posts?.forEach((post) => {
    postsMap[post.id] = post;
  });

  return keys.map((key) => postsMap[key]);
};
const batchTags = async (keys) => {
  const tags = await prisma.tag.findMany({
    where: {
      posts: {
        some: { id: { in: keys } },
      },
    },
    include: {
      posts: true,
    },
  });

  const postTags = {};

  tags.forEach((tag, index) => {
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
      post: new DataLoader<any, Post>(batchPosts, dataLoaderOptions),
      tagsByPostId: new DataLoader<any, Tag[]>(batchTags, dataLoaderOptions),
    },
  };
};

export type ResolverContext = Awaited<ReturnType<typeof context>>;

export const getServerSession = async ({ req }) => {
  try {
    const headers = req.headers;

    const sessionURL =
      (getHeader(headers, "origin") ?? `http://${getHeader(headers, "host")}`) +
      basePath +
      "/api/auth/session";
    console.log(`sessionURL: ${sessionURL}`);
    console.log('session cookie', getHeader(headers, "cookie"))
    const res = await fetch(sessionURL, {
      headers: { cookie: getHeader(headers, "cookie") },
    });
    const session = await res.json();
    return session.user ? session : null;
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log("Error in getServerSession", e);
    // this means the session is not set. This request is probably coming from client and not admin.
    // client will never have a session.
    // It will use authorization header to get the author id or subdmomain name to // get the authorID
  }
};