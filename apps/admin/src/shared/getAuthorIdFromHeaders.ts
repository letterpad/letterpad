import { decryptEmail } from "./clientToken";
import { prisma } from "@/lib/prisma";

interface P {
  identifierHeader: string | null;
  authHeader: string | null;
  authorId: number | null;
}
export async function findEmailFromToken({ authHeader, ...rest }: P) {
  if (!authHeader) {
    return { authHeader, ...rest }
  }
  const token = authHeader.split(/\s+/).pop() || "";
  const tokenData = decryptEmail(token);
  const author = await prisma.author.findUnique({ where: { email: tokenData } });
  if (author) return { authHeader, ...rest, authorId: author.id }
  return { authHeader, ...rest }
}

export async function findAuthorIdFromLetterpadSubdomain({ identifierHeader, ...rest }: P) {
  const found = Object.keys(rest).find(o => rest[o]);
  if (!found) {
    if (identifierHeader?.includes("letterpad.app")) {
      const username = identifierHeader.split(".")[0];
      const author = await prisma.author.findFirst({
        where: {
          username
        },
      });
      if (author)
        return { identifierHeader, ...rest, authorId: author.id }
    }
  }
  return { identifierHeader, ...rest }
}

export async function findAuthorIdFromCustomDomain({ identifierHeader, ...rest }: P) {
  const found = Object.keys(rest).find(o => rest[o]);
  if (!found) {
    if (!identifierHeader) return { identifierHeader, ...rest }
    const record = await prisma.domain.findFirst({
      where: {
        name: identifierHeader,
        mapped: true,
      },
    });
    if (record) {
      return { identifierHeader, ...rest, authorId: record.author_id }
    }
  }
  return { identifierHeader, ...rest }

}