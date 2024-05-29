import { prisma } from "@/lib/prisma";
interface P {
  identifierHeader: string | null;
  authHeader: string | null;
  authorId: string | null;
}
export async function findEmailFromToken({ authHeader, ...rest }: P) {
  if (!authHeader) {
    return { authHeader, ...rest };
  }
  const token = authHeader.split(/\s+/).pop() || "";
  if (token !== "null") {
    const author = await prisma.author.findUnique({
      where: { id: token },
    });
    if (author) return { authHeader, ...rest, authorId: author.id };
  }
  return { authHeader, ...rest };
}

export async function findAuthorIdFromLetterpadSubdomain({
  identifierHeader,
  authHeader,
  authorId,
}: P) {
  if (!authorId) {
    if (identifierHeader?.includes("letterpad.app")) {
      const username = identifierHeader.split(".")[0];
      const author = await prisma.author.findFirst({
        where: {
          username,
        },
      });
      if (author) return { identifierHeader, authHeader, authorId: author.id };
    }
    if (identifierHeader?.includes("letterpad-client-git")) {
      const author = await prisma.author.findFirst({
        where: {
          username: 'demo',
        },
      });
      if (author) return { identifierHeader, authHeader, authorId: author.id };
    }
  }
  return { identifierHeader, authHeader, authorId };
}

export async function findAuthorIdFromCustomDomain({
  identifierHeader,
  authHeader,
  authorId,
}: P) {
  if (!authorId && identifierHeader) {
    const author = await prisma.domain.findFirst({
      where: {
        name: identifierHeader,
        mapped: true,
      },
    });
    if (author) {
      return { identifierHeader, authHeader, authorId: author.author_id };
    }
  }
  return { identifierHeader, authHeader, authorId };
}
