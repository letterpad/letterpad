import logger from "./logger";
import { Context } from "@apollo/client";
import { Prisma, PrismaClient } from "@prisma/client";
import { decryptEmail } from "./clientToken";

const authHeaderPrefix = "Basic ";
const prisma = new PrismaClient();

const getAuthorIdFromRequest = async (context: Context) => {
  const authHeader = context.req?.headers?.authorization || "";
  let author_id: number | null = null;

  try {
    author_id = await getAuthorFromSubdomain(context);
    if (author_id) {
      logger.debug("Author from subdomain - ", author_id);
    }

    if (!author_id && authHeader.length > authHeaderPrefix.length) {
      const email = getAuthorFromAuthHeader(authHeader);
      const author = await prisma.author.findFirst({
        where: { email },
        select: { id: true },
      });
      if (author) author_id = author.id;

      if (author_id) {
        logger.debug(
          "Author from Authorization header after decrypting - ",
          author_id,
        );
      }
    }
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      if (e.code === "P2021") {
        throw new Error(
          "Database is not ready. Run `yarn seed` from terminal.",
        );
      }
    } else {
      throw new Error(e);
    }
  }
  return author_id;
};
export default getAuthorIdFromRequest;

async function getAuthorFromSubdomain(context) {
  if (!context.req.headers) {
    logger.debug("No identifier found - Internal admin request - OK");
  } else if (context.req.headers?.identifier?.includes("letterpad.app")) {
    const { identifier } = context.req.headers;
    logger.debug("Host for checking subdomain - ", identifier);
    const username = identifier.split(".")[0];
    const author = await prisma.author.findFirst({
      where: { username },
      distinct: ["id"],
    });
    return author ? author.id : null;
  }
  return null;
}

function getAuthorFromAuthHeader(authHeader: string) {
  const token = authHeader.split(/\s+/).pop() || "";
  const tokenData = decryptEmail(token);
  logger.debug("Authorisation Header to tokenData  - ", tokenData);
  //@ts-ignore
  return tokenData;
}
