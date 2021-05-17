import jwt from "jsonwebtoken";
import { getSession } from "next-auth/client";
import { ApolloServer } from "apollo-server-micro";
import models from "@/graphql/db/models";
import { schema } from "@/graphql/schema";
import logger from "shared/logger";

const apolloServer = new ApolloServer({
  schema,
  context: async context => {
    const authHeader = context.req?.headers.authorization || "";
    let author_id;
    try {
      author_id = await getAuthorFromSubdomain(context);
      logger.debug("Author from subdomain - ", author_id);
      if (!author_id && authHeader) {
        author_id = getAuthorFromAuthHeader(authHeader);
        logger.debug("Author from header - ", author_id);
      }
    } catch (e) {
      console.log("e :>> ", e);
    }
    const session = await getSession(context);
    return { ...context, models, author_id, session };
  },
  introspection: true,
});

export const config = {
  api: {
    bodyParser: false,
  },
};

export default apolloServer.createHandler({
  path: "/api/graphql",
});

async function getAuthorFromSubdomain(context) {
  const { host } = context.req.headers;
  logger.debug("Host for checking subdomain - ", host);
  if (host && host.includes("letterpad.app")) {
    const username = host.split(".")[0];
    const author = await models.Author.findOne({
      attributes: ["id"],
      where: { username },
    });
    return author ? author.id : null;
  }
  return null;
}

function getAuthorFromAuthHeader(authHeader: string) {
  const token = authHeader.split(/\s+/).pop() || "";
  const tokenData = jwt.verify(token, process.env.SECRET_KEY);
  logger.debug("Authorisation Header to tokenData  - ", tokenData);
  return tokenData?.id;
}
