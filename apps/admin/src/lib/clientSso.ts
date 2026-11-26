import { createHash, randomBytes } from "node:crypto";
import { decode, encode, JWT } from "next-auth/jwt";

import { prisma } from "@/lib/prisma";

export const CLIENT_SESSION_COOKIE = "__Host-letterpad-client-session";
const CODE_AGE = 60;
const SESSION_AGE = 30 * 24 * 60 * 60;
const secret = () => `${process.env.SECRET_KEY}:letterpad-client-sso`;
const digest = (value: string) =>
  createHash("sha256").update(value).digest("hex");
export const ssoChallenge = (verifier: string) =>
  createHash("sha256").update(verifier).digest("base64url");
const expiry = (seconds: number) => new Date(Date.now() + seconds * 1000);

// NextAuth rotates jti when its JWT is refreshed. Older cookies have no
// dedicated SSO ID, so they share an account-level revocation group.
export const parentSessionId = (token: JWT) =>
  typeof token.ssoSessionId === "string"
    ? token.ssoSessionId
    : token.sub && `legacy:${token.sub}`;

const recordKey = (kind: string, parent: string) =>
  `letterpad:sso:${kind}:${digest(parent)}`;

async function revoked(parent: string) {
  return !!(await prisma.verificationRequest.findFirst({
    where: { identifier: recordKey("revoked", parent), expires: { gt: new Date() } },
  }));
}

export async function revokeClientSessions(parent: string) {
  const identifier = recordKey("revoked", parent);
  const expires = expiry(SESSION_AGE);
  await prisma.verificationRequest.upsert({
    where: { identifier_token: { identifier, token: "revoked" } },
    create: { identifier, token: "revoked", expires },
    update: { expires },
  });
}

export async function issueClientCode(token: JWT, origin: string, challenge: string) {
  const parent = parentSessionId(token);
  if (!parent || !token.sub || !token.exp || await revoked(parent)) return null;
  const code = await encode({
    secret: secret(),
    maxAge: CODE_AGE,
    token: {
      kind: "code", parent, origin, challenge, sub: token.sub,
      parentExpires: token.exp,
    },
  });
  await prisma.verificationRequest.create({
    data: { identifier: recordKey("code", parent), token: digest(code), expires: expiry(CODE_AGE) },
  });
  return code;
}

async function readToken(value: string, kind: string, origin: string) {
  try {
    const token = await decode({ secret: secret(), token: value });
    if (token?.kind !== kind || token.origin !== origin ||
        typeof token.parent !== "string" || typeof token.sub !== "string" ||
        typeof token.parentExpires !== "number" || token.parentExpires <= Date.now() / 1000 ||
        await revoked(token.parent)) return null;
    return { ...token, parent: token.parent, sub: token.sub, parentExpires: token.parentExpires };
  } catch {
    return null;
  }
}

export async function exchangeClientCode(code: string, origin: string, verifier: string) {
  const grant = await readToken(code, "code", origin);
  if (!grant || grant.challenge !== ssoChallenge(verifier)) return null;
  const maxAge = Math.min(SESSION_AGE, Math.floor(grant.parentExpires - Date.now() / 1000));
  if (maxAge < 1) return null;

  const session = await encode({
    secret: secret(),
    maxAge,
    token: {
      kind: "session", parent: grant.parent, sub: grant.sub, origin,
      parentExpires: grant.parentExpires, nonce: randomBytes(16).toString("hex"),
    },
  });
  const exchanged = await prisma.$transaction(async (tx) => {
    const result = await tx.verificationRequest.deleteMany({
      where: { identifier: recordKey("code", grant.parent), token: digest(code), expires: { gt: new Date() } },
    });
    if (result.count !== 1) return false;
    await tx.verificationRequest.create({
      data: { identifier: recordKey("session", grant.parent), token: digest(session), expires: expiry(maxAge) },
    });
    return true;
  });
  return exchanged ? { session, maxAge } : null;
}

export async function readClientSession(value: string, origin: string) {
  const token = await readToken(value, "session", origin);
  if (!token) return null;
  const record = await prisma.verificationRequest.findFirst({
    where: { identifier: recordKey("session", token.parent), token: digest(value), expires: { gt: new Date() } },
  });
  if (!record) return null;
  const user = await prisma.author.findUnique({
    where: { id: token.sub },
    select: { id: true, name: true, avatar: true, username: true },
  });
  return user ? { user } : null;
}

export async function removeClientSession(value: string, origin: string) {
  const token = await readToken(value, "session", origin);
  if (token) {
    await prisma.verificationRequest.deleteMany({
      where: { identifier: recordKey("session", token.parent), token: digest(value) },
    });
  }
}

export async function allowedClientOrigin(origin: string) {
  let url: URL;
  try { url = new URL(origin); } catch { return false; }
  if (url.origin !== origin || url.protocol !== "https:") return false;
  if (process.env.LETTERPAD_SSO_CLIENT_ORIGINS?.split(",").map((value) => value.trim()).includes(origin)) return true;
  if (url.port) return false;
  const blog = /^([^.]+)\.letterpad\.app$/.exec(url.hostname);
  if (blog && await prisma.author.findUnique({ where: { username: blog[1] }, select: { id: true } })) return true;
  return !!(await prisma.domain.findFirst({
    where: { name: url.hostname, mapped: true },
    select: { id: true },
  }));
}

export async function removeExpiredSsoRecords() {
  await prisma.verificationRequest.deleteMany({
    where: { identifier: { startsWith: "letterpad:sso:" }, expires: { lte: new Date() } },
  });
}
