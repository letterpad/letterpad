import { NextRequest, NextResponse, userAgent } from "next/server";
import { decode } from "next-auth/jwt";
import { getAuthCookieName } from "./utils/authCookie";

export const config = { matcher: "/((?!.*\\.).*)" };

export async function middleware(request: NextRequest) {
  const { device } = userAgent(request);
  const cookie = request.cookies.get(getAuthCookieName());
  const proto = request.headers.get("x-forwarded-proto");
  const host = request.headers.get("host");
  const callbackUrl = new URL(request.url).searchParams.get("callbackUrl");

  if (!process.env.SECRET_KEY) {
    throw new Error(
      "You have not setup the variable SECRET_KEY in `apps/admin/.env`. If you do not have this `.env` file, you can copy it from `apps/admin/.env.sample`. Set its value to a secret string."
    );
  }
  const ROOT_URL = proto + "://" + host;

  if (cookie?.value) {
    try {
      const decoded = await decode({
        token: cookie.value,
        secret: process.env.SECRET_KEY,
      });
      if (!decoded?.email) {
        return NextResponse.redirect(ROOT_URL + "/login");
      }
    } catch (e) {
      // return NextResponse.redirect(ROOT_URL + "/login");
    }
  }
  const nextUrl = request.nextUrl;

  return NextResponse.rewrite(nextUrl);
}
