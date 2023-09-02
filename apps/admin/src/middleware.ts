import { NextRequest, NextResponse, userAgent } from "next/server";
import { decode } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  const { device } = userAgent(request);
  const cookie = request.cookies.get("next-auth.session-token");
  const proto = request.headers.get("x-forwarded-proto");
  const host = request.headers.get("host");

  const ROOT_URL = proto + "://" + host;
  if (cookie) {
    const decoded = await decode({
      token: cookie?.value,
      secret: process.env.SECRET_KEY,
    });

    if (!decoded?.email) {
      return NextResponse.redirect(ROOT_URL + "/login");
    }
  }

  const viewport = device.type === "mobile" ? "mobile" : "desktop";
  const nextUrl = request.nextUrl;
  nextUrl.searchParams.set("viewport", viewport);

  return NextResponse.rewrite(nextUrl);
}
