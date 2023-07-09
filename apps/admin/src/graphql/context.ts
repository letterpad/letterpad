import { prisma } from "@/lib/prisma";

import getAuthorIdFromRequest from "@/shared/getAuthorIdFromRequest";

import { SessionData } from "./types";
import { basePath } from "../constants";

const isTest = process.env.NODE_ENV === "test";

export const getServerSession = async (context) => {
  const sessionURL =
    context.req.headers.origin + basePath + "/api/auth/session";
  const res = await fetch(sessionURL, {
    headers: { cookie: context.req.headers.cookie },
  });
  const session = await res.json();
  return session;
};

export const getResolverContext = async (context) => {
  const session = isTest
    ? null
    : ((await getServerSession(context)) as unknown as { user: SessionData });
  let client_author_id: number | null = null;

  if (!session?.user.id) {
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
