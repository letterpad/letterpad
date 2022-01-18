import logger from "./logger";
import { Context } from "@apollo/client";
import { verifyToken } from "./token";
import * as Sentry from "@sentry/nextjs";
import { Author } from "@/graphql/db/models/definations/author";
const authHeaderPrefix = "Basic ";

const printOnce = {
  env: 0,
};
export default async (context: Context) => {
  const authHeader = context.req?.headers?.authorization || "";
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
    if (process.env.NODE_ENV !== "production") {
      if (!printOnce.env) {
        logger.debug("development mode");
        printOnce.env = 1;
      }
      const author = await Author.findOne({
        where: { email: "demo@demo.com" },
      });
      if (author) {
        author_id = author.id;
      }
    }
  } catch (e) {
    Sentry.captureException(e);
    logger.error("Error in getting author_id from request", e);
  }
  return author_id;
};

async function getAuthorFromSubdomain(context) {
  if (!context.req.headers) {
    logger.debug("No identifier found - Internal admin request - OK");
  } else if (context.req.headers?.identifier?.includes("letterpad.app")) {
    const { identifier } = context.req.headers;
    logger.debug("Host for checking subdomain - ", identifier);
    const username = identifier.split(".")[0];
    const author = await Author.findOne({
      attributes: ["id"],
      where: { username },
    });
    return author ? author.id : null;
  }
  return null;
}

function getAuthorFromAuthHeader(authHeader: string) {
  const token = authHeader.split(/\s+/).pop() || "";
  const tokenData = verifyToken(token);
  logger.debug("Authorisation Header to tokenData  - ", tokenData);
  //@ts-ignore
  return tokenData?.id;
}
