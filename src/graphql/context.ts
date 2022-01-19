import MailService from "@/graphql/mail/service";
import getAuthorIdFromRequest from "@/shared/getAuthorIdFromRequest";
import { getSession } from "next-auth/react";
import connection, { models, ModelsType } from "./db/models/models";
import { SessionData } from "./types";

const mailUtils = MailService<ModelsType>(models);
const isTest = process.env.NODE_ENV === "test";

export const getResolverContext = async ({ req }) => {
  const session = isTest
    ? null
    : ((await getSession({ req })) as unknown as { user: SessionData });

  let author_id = session?.user?.id;
  if (!author_id) {
    author_id = await getAuthorIdFromRequest({
      req,
    });
  }

  return {
    connection,
    models,
    mailUtils,
    session,
    author_id,
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
