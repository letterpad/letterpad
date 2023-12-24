// import { Author } from "@prisma/client";
import { Author, Post, Setting, Tag } from "@prisma/client";
import DataLoader from "dataloader";

import { prisma } from "@/lib/prisma";

import getAuthorIdFromRequest from "@/shared/getAuthorIdFromRequest";

import post from "./resolvers/post";
import { SessionData } from "./types";
import { basePath } from "../constants";
import { db } from "../lib/drizzle";
import { DbPost } from "../types";
import { getHeader } from "../utils/headers";

const isTest = process.env.NODE_ENV === "test";

export const getServerSession = async ({ req }) => {
  try {
    const headers = req.headers;
    const sessionURL =
      (getHeader(headers, "origin") ?? `http://${getHeader(headers, "host")}`) +
      basePath +
      "/api/auth/session";
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

export const getResolverContext = async (request: Request) => {
  let client_author_id: number | null = null;
  const authorIdFound = await getAuthorIdFromRequest(request);
  console.log("authorIdFound", authorIdFound);
  if (authorIdFound) {
    client_author_id = authorIdFound;
    return { client_author_id, session: null };
  } else {
    const session = isTest
      ? null
      : ((await getServerSession({ req: request })) as unknown as {
          user: SessionData;
        });
    if (!session?.user?.id) {
    } else {
      client_author_id = session.user.id;
    }
    console.log("client_author_id", client_author_id);
    if (client_author_id) {
      return {
        session,
        client_author_id,
      };
    }

    return {
      session,
    };
  }
};

const batchAuthors = async (keys) => {
  const authors = await db.query.Author.findMany({
    where: (author, { inArray }) => inArray(author.id, keys),
  });

  const authorMap = {};

  authors?.forEach((author) => {
    authorMap[author.id] = author;
  });
  return keys.map((key) => authorMap[key]);
};

const batchSettings = async (keys) => {
  const settings = await db.query.Setting.findMany({
    where: (setting, { inArray }) => inArray(setting.author_id, keys),
  });

  const settingsMap = {};

  settings?.forEach((setting) => {
    settingsMap[keys[0]] = setting;
  });

  return keys.map((key) => settingsMap[key]);
};

const batchPosts = async (keys) => {
  const posts = await db.query.Post.findMany({
    where: (post, { inArray }) => inArray(post.id, keys),
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

export const context = async ({ request }) => {
  const resolverContext = await getResolverContext(request);

  return {
    ...resolverContext,
    prisma,
    dataloaders: {
      author: new DataLoader<any, Author>(batchAuthors),
      setting: new DataLoader<any, Setting>(batchSettings),
      post: new DataLoader<any, DbPost>(batchPosts),
      tagsByPostId: new DataLoader<any, Tag[]>(batchTags),
    },
  };
};

type Awaited<T> = T extends null | undefined
  ? T // special case for `null | undefined` when not in `--strictNullChecks` mode
  : T extends object & { then(onfulfilled: infer F): any } // `await` only unwraps object types with a callable `then`. Non-object types are not unwrapped
  ? F extends (value: infer V, ...args: any) => any // if the argument to `then` is callable, extracts the first argument
    ? Awaited<V> // recursively unwrap the value
    : never // the argument to `then` was not callable
  : T; // non-object or non-thenable

export type ResolverContext = Awaited<ReturnType<typeof context>>;
