import { createHash, randomBytes } from "node:crypto";

import { Role } from "letterpad-graphql";

import { prisma } from "@/lib/prisma";

const TOKEN_LIFETIME_MS = 90 * 24 * 60 * 60 * 1000;
const writerRoleNames = [Role.Admin, Role.Author];
const tokenMetadata = {
  id: true,
  name: true,
  createdAt: true,
  expiresAt: true,
} as const;

function hashToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

export async function getMcpWriter(authorization: string | null) {
  const token = /^Bearer (lp_mcp_[A-Za-z0-9_-]{43})$/i.exec(
    authorization ?? ""
  )?.[1];
  if (!token) return null;

  const match = await prisma.mcpToken.findUnique({
    where: { token_hash: hashToken(token) },
    select: {
      expiresAt: true,
      author: { select: { id: true, role: { select: { name: true } } } },
    },
  });
  if (
    !match?.author ||
    match.expiresAt <= new Date() ||
    !writerRoleNames.some((role) => role === match.author.role?.name)
  ) {
    return null;
  }
  return match.author.id;
}

export async function canIssueMcpToken(authorId: string) {
  const author = await prisma.author.findFirst({
    where: { id: authorId, role: { name: { in: writerRoleNames } } },
    select: { id: true },
  });
  return !!author;
}

export async function issueMcpToken(authorId: string, name: string) {
  const token = "lp_mcp_" + randomBytes(32).toString("base64url");
  const metadata = await prisma.mcpToken.create({
    data: {
      name,
      author_id: authorId,
      token_hash: hashToken(token),
      expiresAt: new Date(Date.now() + TOKEN_LIFETIME_MS),
    },
    select: tokenMetadata,
  });
  return { ...metadata, token };
}

export function listMcpTokens(authorId: string) {
  return prisma.mcpToken.findMany({
    where: { author_id: authorId, expiresAt: { gt: new Date() } },
    orderBy: { createdAt: "desc" },
    select: tokenMetadata,
  });
}

export async function revokeMcpToken(authorId: string, id: string) {
  const result = await prisma.mcpToken.deleteMany({
    where: { id, author_id: authorId },
  });
  return result.count > 0;
}
