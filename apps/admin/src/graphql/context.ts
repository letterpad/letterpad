import { prisma } from "@/lib/prisma";

import getAuthorIdFromRequest from "@/shared/getAuthorIdFromRequest";

import { SessionData } from "./types";
import { basePath } from "../constants";
import { getHeader } from "../utils/headers";

const isTest = process.env.NODE_ENV === "test";

export const getServerSession = async (context) => {
  try {
    const headers = context.req.headers;
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
    console.log("Error in getServerSession");
    // this means the session is not set. This request is probably coming from client and not admin.
    // client will never have a session.
    // It will use authorization header to get the author id or subdmomain name to // get the authorID
  }
};

export const getResolverContext = async (context) => {
  const session = isTest
    ? null
    : ((await getServerSession(context)) as unknown as { user: SessionData });
  let client_author_id: number | null = null;
  const isLetterpadAdmin = context.req.headers["letterpad-admin"];
  if (!session?.user?.id) {
    const authorIdFound = await getAuthorIdFromRequest(context);
    if (authorIdFound) {
      client_author_id = authorIdFound;
    }
  } else {
    client_author_id = session.user.id;
  }

  if (client_author_id) {
    return {
      session,
      client_author_id,
      prisma,
    };
  }

  return {
    session,
    prisma,
    isLetterpadAdmin,
  };
};

type Awaited<T> = T extends null | undefined
  ? T // special case for `null | undefined` when not in `--strictNullChecks` mode
  : T extends object & { then(onfulfilled: infer F): any } // `await` only unwraps object types with a callable `then`. Non-object types are not unwrapped
  ? F extends (value: infer V, ...args: any) => any // if the argument to `then` is callable, extracts the first argument
    ? Awaited<V> // recursively unwrap the value
    : never // the argument to `then` was not callable
  : T; // non-object or non-thenable

export type ResolverContext = Awaited<ReturnType<typeof getResolverContext>>;
