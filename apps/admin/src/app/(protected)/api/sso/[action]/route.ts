import { createHmac, timingSafeEqual } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

import {
  allowedClientOrigin,
  exchangeClientCode,
  issueClientCode,
  readClientSession,
  removeClientSession,
  removeExpiredSsoRecords,
} from "@/lib/clientSso";
import { getLoginUrl, getRootUrl } from "@/shared/getRootUrl";

export const dynamic = "force-dynamic";
const headers = {
  "Cache-Control": "no-store",
  "Referrer-Policy": "no-referrer",
};
const challengePattern = /^[\w-]{43}$/;

export async function GET(
  req: NextRequest,
  { params }: { params: { action: string } }
) {
  if (params.action !== "authorize")
    return new Response(null, { status: 404, headers });
  const { searchParams } = req.nextUrl;
  const origin = searchParams.get("origin") ?? "";
  const challenge = searchParams.get("challenge") ?? "";
  const proof = searchParams.get("proof") ?? "";
  const expires = Number(searchParams.get("expires"));
  const now = Math.floor(Date.now() / 1000);
  const secret = process.env.LETTERPAD_SSO_SECRET;
  if (
    !secret ||
    !challengePattern.test(challenge) ||
    !challengePattern.test(proof) ||
    !Number.isSafeInteger(expires) ||
    expires <= now ||
    expires > now + 15 * 60
  ) {
    return new Response(null, { status: 400, headers });
  }
  const expected = createHmac("sha256", secret)
    .update(JSON.stringify([origin, challenge, expires]))
    .digest("base64url");
  if (
    !timingSafeEqual(Buffer.from(proof), Buffer.from(expected)) ||
    !(await allowedClientOrigin(origin))
  ) {
    return new Response(null, { status: 400, headers });
  }
  const callback = new URL("/api/sso/callback", origin);
  callback.searchParams.set("challenge", challenge);

  const token = await getToken({
    req,
    secret: process.env.SECRET_KEY,
    secureCookie: new URL(getRootUrl()).protocol === "https:",
  });
  const code = token && (await issueClientCode(token, origin, challenge));
  if (code) {
    await removeExpiredSsoRecords();
    callback.searchParams.set("code", code);
  } else if (!token && searchParams.get("interactive") === "1") {
    const login = new URL(getLoginUrl());
    const resume = new URL("/api/sso/authorize", getRootUrl());
    resume.searchParams.set("origin", origin);
    resume.searchParams.set("challenge", challenge);
    resume.searchParams.set("expires", String(expires));
    resume.searchParams.set("proof", proof);
    login.searchParams.set("callbackUrl", resume.href);
    return NextResponse.redirect(login, { headers });
  }
  return NextResponse.redirect(callback, { headers });
}

export async function POST(
  req: NextRequest,
  { params }: { params: { action: string } }
) {
  const secret = process.env.LETTERPAD_SSO_SECRET;
  const supplied = Buffer.from(req.headers.get("authorization") ?? "");
  const expected = Buffer.from(`Bearer ${secret}`);
  if (
    !secret ||
    supplied.length !== expected.length ||
    !timingSafeEqual(supplied, expected)
  ) {
    return new Response(null, { status: 403, headers });
  }
  const data = await req.json().catch(() => null);
  if (
    !data ||
    typeof data.origin !== "string" ||
    typeof data.token !== "string"
  ) {
    return NextResponse.json(null, { status: 400, headers });
  }
  const { origin, token, verifier } = data;
  switch (params.action) {
    case "exchange":
      return NextResponse.json(
        typeof verifier === "string" &&
          challengePattern.test(verifier) &&
          (await allowedClientOrigin(origin))
          ? await exchangeClientCode(token, origin, verifier)
          : null,
        { headers }
      );
    case "session": {
      const session = await readClientSession(token, origin);
      if (!session) return NextResponse.json(null, { headers });
      const { name, avatar, username } = session.user;
      return NextResponse.json(
        { user: { name, avatar, username } },
        { headers }
      );
    }
    case "logout":
      await removeClientSession(token, origin);
      return NextResponse.json(null, { headers });
    default:
      return new Response(null, { status: 404, headers });
  }
}
