import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

import { allowedClientOrigin } from "@/lib/clientSso";
import { getLoginUrl, getRootUrl } from "@/shared/getRootUrl";

export async function GET(
  req: NextRequest,
  { params }: { params: { action: string } }
) {
  if (params.action !== "login") return new Response(null, { status: 404 });
  const root = new URL(getRootUrl());
  const headers = {
    "Cache-Control": "no-store",
    "Referrer-Policy": "no-referrer",
  };
  let target: URL;
  try {
    target = new URL(req.nextUrl.searchParams.get("source") ?? "/posts", root);
  } catch {
    return new Response(null, { status: 400, headers });
  }
  if (target.origin !== root.origin) {
    if (!(await allowedClientOrigin(target.origin))) {
      return new Response(null, { status: 400, headers });
    }
    const start = new URL("/api/sso/start", target.origin);
    start.searchParams.set(
      "return",
      target.pathname + target.search + target.hash
    );
    start.searchParams.set("interactive", "1");
    return NextResponse.redirect(start, { headers });
  }
  if (target.pathname.startsWith("/api/")) target = new URL("/posts", root);
  const token = await getToken({
    req,
    secret: process.env.SECRET_KEY,
    secureCookie: root.protocol === "https:",
  });
  if (token) return NextResponse.redirect(target, { headers });
  const login = new URL(getLoginUrl());
  login.searchParams.set("callbackUrl", target.href);
  return NextResponse.redirect(login, { headers });
}
