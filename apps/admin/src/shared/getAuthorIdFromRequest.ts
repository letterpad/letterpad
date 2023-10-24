import { Prisma, PrismaClient } from "@prisma/client";

import { prisma } from "@/lib/prisma";

import { report } from "@/components/error";

import { decryptEmail } from "./clientToken";
import logger from "./logger";
import { getHeader } from "../utils/headers";

const authHeaderPrefix = "Basic ";

const getAuthorIdFromRequest = async (request: Request) => {
  const authHeader = getHeader(request.headers, "authorization");
  let author_id: number | null = null;
  if (!authHeader || authHeader.length === 0) return author_id;

  try {
    const email = getAuthorFromAuthHeader(authHeader);
    const author = await prisma.author.findFirst({
      where: { email },
      select: { id: true },
    });
    if (author) author_id = author.id;

    if (author_id) {
      logger.debug(
        "Author from Authorization header after decrypting - ",
        author_id
      );
    } else {
      logger.error("Failed to find email in header token => ", authHeader, {
        host: getHeader(request.headers, "host"),
      });
    }

    if (!author_id) {
      author_id = await getAuthorFromCustomDomain(request);
      logger.debug("Author from custom domain - ", author_id);
    }

    if (!author_id) {
      author_id = await getAuthorFromLetterpadSubdomain(request);

      if (author_id) {
        logger.debug("Author from subdomain - ", author_id);
      }
    }

    if (process.env.DOCKER === "true" && process.env.EMAIL) {
      const author = await prisma.author.findFirst({
        where: { email: process.env.EMAIL },
        select: { id: true },
      });
      if (author) author_id = author.id;
    }
  } catch (e: any) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      if (e.code === "P2021") {
        throw new Error(
          "Database is not ready. Run `yarn seed` from terminal."
        );
      }
    } else {
      report.error(e);
    }
  }
  return author_id;
};
export default getAuthorIdFromRequest;

async function getAuthorFromLetterpadSubdomain(request: Request) {
  if (!request.headers) {
    logger.debug("No identifier found - Internal admin request - OK");
  } else if (
    getHeader(request.headers, "identifier")?.includes("letterpad.app")
  ) {
    const identifier = getHeader(request.headers, "identifier");
    logger.debug("Host for checking subdomain - ", identifier);
    const username = identifier.split(".")[0];
    const author = await prisma.author.findUnique({
      where: { username },
    });
    return author ? author.id : null;
  }
  return null;
}

async function getAuthorFromCustomDomain(request: Request) {
  // eslint-disable-next-line no-console
  console.log(request.headers);
  if (!getHeader(request.headers, "identifier")) return null;

  const domain = request.headers["identifier"];
  if (!domain) return null;

  const record = await prisma.domain.findFirst({
    where: {
      name: domain,
      mapped: true,
    },
  });
  return record ? record.author_id : null;
}

function getAuthorFromAuthHeader(authHeader: string) {
  const token = authHeader.split(/\s+/).pop() || "";
  const tokenData = decryptEmail(token);
  return tokenData;
}
