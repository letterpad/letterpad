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
  if (token !== "null") {
    const tokenData = decryptEmail(token);
    const author = await prisma.author.findUnique({ where: { email: tokenData } });
    if (author) return { authHeader, ...rest, authorId: author.id }
  }
  console.log("No token found");
  return { authHeader, ...rest }
}

export async function findAuthorIdFromLetterpadSubdomain({ identifierHeader, authHeader, authorId }: P) {
  if (!authorId) {
    if (identifierHeader?.includes("letterpad.app")) {
      const username = identifierHeader.split(".")[0];
      const author = await prisma.author.findFirst({
        where: {
          username
        },
      });
      if (author)
        return { identifierHeader, authHeader, authorId: author.id }
    }
  }
  console.log("No subdomain found");
  return { identifierHeader, authHeader, authorId }
}

export async function findAuthorIdFromCustomDomain({ identifierHeader, authHeader, authorId }: P) {
  if (!authorId && identifierHeader) {
    const author = await prisma.domain.findFirst({
      where: {
        name: identifierHeader,
        mapped: true,
      },
    });
    if (author) {
      console.log("author from custom domain", author.id + " : " + author.name)
      return { identifierHeader, authHeader, authorId: author.author_id }
    }
  }
  console.log("No domain found");
  return { identifierHeader, authHeader, authorId }

}