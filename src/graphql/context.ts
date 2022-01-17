import MailService from "@/graphql/mail/service";
import getAuthorIdFromRequest from "@/shared/getAuthorIdFromRequest";
import { NextApiRequest } from "next";
import { getSession } from "next-auth/react";
import connection, { models, ModelsType } from "./db/models/index2";
import { SessionData } from "./types";

const mailUtils = MailService<ModelsType>(models);
const isTest = process.env.NODE_ENV === "test";

export const getResolverContext = async (req: NextApiRequest) => {
  const session = isTest
    ? null
    : ((await getSession({ req })) as unknown as { user: SessionData });

  const author_id: number | undefined = isTest
    ? await getAuthorIdFromRequest({
        req,
      })
    : null;
  return {
    connection,
    models,
    mailUtils,
    session,
    author_id,
  };
};

export type ResolverContext = Awaited<ReturnType<typeof getResolverContext>>;
