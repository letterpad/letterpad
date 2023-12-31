import { NextRequest, NextResponse, userAgent } from "next/server";
import { decode } from "next-auth/jwt";
import { andThen, pipe } from "ramda";
import { findAuthorIdFromCustomDomain, findAuthorIdFromLetterpadSubdomain, findEmailFromToken } from "./shared/getAuthorIdFromHeaders";

export const config = { matcher: "/((?!.*\\.).*)" };

export async function middleware(request: NextRequest) {
  const { device } = userAgent(request);
  const cookie = request.cookies.get("next-auth.session-token");
  const proto = request.headers.get("x-forwarded-proto");
  const host = request.headers.get("host");
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

  const authHeader = request.headers.get("authorization");
  const identifierHeader = request.headers.get("identifier");

  let { authorId } = await pipe(
    findEmailFromToken,
    andThen(findAuthorIdFromLetterpadSubdomain),
    andThen(findAuthorIdFromCustomDomain))
    ({ authHeader, identifierHeader, authorId: null });

  const viewport = device.type === "mobile" ? "mobile" : "desktop";
  const nextUrl = request.nextUrl;
  nextUrl.searchParams.set("viewport", viewport);
  if(authorId) nextUrl.searchParams.set("authorId", authorId.toString());

  return NextResponse.rewrite(nextUrl);
}
