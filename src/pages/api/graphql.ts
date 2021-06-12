import jwt from "jsonwebtoken";
import { getSession } from "next-auth/client";
import { ApolloServer } from "apollo-server-micro";
import models from "@/graphql/db/models";
import { schema } from "@/graphql/schema";
import logger from "shared/logger";

const authHeaderPrefix = "Basic ";
const apolloServer = new ApolloServer({
  schema,
  context: async (context) => {
    const authHeader = context.req?.headers.authorization || "";
    let author_id;
    try {
      author_id = await getAuthorFromSubdomain(context);
      if (author_id) {
        logger.debug("Author from subdomain - ", author_id);
      }

      if (!author_id && authHeader.length > authHeaderPrefix.length) {
        author_id = getAuthorFromAuthHeader(authHeader);
        if (author_id) {
          logger.debug(
            "Author from Authorization header after decrypting - ",
            author_id,
          );
        }
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
  const { identifier } = context.req.headers;
  logger.debug("Host for checking subdomain - ", identifier);
  if (identifier && identifier.includes("letterpad.app")) {
    const username = identifier.split(".")[0];
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
  //@ts-ignore
  return tokenData?.id;
}
