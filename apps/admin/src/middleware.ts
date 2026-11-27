import { RegisterStep } from "letterpad-graphql";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { isInMaintenanceModeEnabled } from "ui/dist/server.mjs";

import { SessionData } from "./graphql/types";
import { getAuthCookieName } from "./utils/authCookie";

export const config = {
  matcher:
    "/((?!_next/static|_next/image|logo|manifest.webmanifest|favicon.ico|graphql|api/auth|api/graphql|api/sso/|api/identity/).*)",
};

const isPlatform = process.env.LETTERPAD_PLATFORM;

export async function middleware(request: NextRequest) {
  try {
    const isInMaintenanceMode = await isInMaintenanceModeEnabled();
    if (isInMaintenanceMode) {
      request.nextUrl.pathname = `/maintenance`;
      return NextResponse.rewrite(request.nextUrl);
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
  }
  const proto = request.headers.get("x-forwarded-proto");
  const host = request.headers.get("host");
  const ROOT_URL = proto + "://" + host;

  const pathname = request.nextUrl.pathname;
  try {
    const user = (await getToken({
      req: request,
      secret: process.env.SECRET_KEY,
      cookieName: getAuthCookieName(),
    })) as unknown as SessionData | null;

    if (user && !user.email && pathname !== "/login") {
      return NextResponse.redirect(ROOT_URL + "/login");
    }

    if (user?.email) {
      if (!pathname.includes("/update/") && pathname !== "/") {
        if (user.register_step === RegisterStep.ProfileInfo) {
          return NextResponse.redirect(ROOT_URL + "/update/profile-info");
        }
        if (user.register_step === RegisterStep.SiteInfo) {
          return NextResponse.redirect(ROOT_URL + "/update/site-info");
        }
      }
      if (
        pathname.includes("/update") &&
        user.register_step === RegisterStep.Registered
      ) {
        return NextResponse.redirect(ROOT_URL + "/posts");
      }
      if (["/login", "/register"].includes(pathname)) {
        return NextResponse.redirect(ROOT_URL + "/posts");
      }
    }
  } catch (e) {
    // An invalid or expired session should be handled by the page's auth flow.
  }
  if (pathname === "/" && !isPlatform) {
    return NextResponse.redirect(ROOT_URL + "/login");
  }
  if (!process.env.SECRET_KEY) {
    throw new Error(
      "You have not setup the variable SECRET_KEY in `apps/admin/.env`. If you do not have this `.env` file, you can copy it from `apps/admin/.env.sample`. Set its value to a secret string."
    );
  }

  if (request.nextUrl.pathname === "/posts") {
    const isPricing = request.cookies.get("loginRedirect")?.value === "pricing";
    if (isPricing) {
      return NextResponse.redirect(ROOT_URL + "/membership", {
        headers: new Headers({
          "Set-Cookie":
            "loginRedirect=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT",
        }),
      });
    }
  }
  const nextUrl = request.nextUrl;
  if (request.nextUrl.pathname === "/") {
    let participant = cookies().get("trendingPosition")?.value;
    if (!participant) {
      const isControl = Math.random() > 0.5;
      participant = isControl ? "control" : "variation";
      request.nextUrl.searchParams.set(
        "testVersion",
        `${isControl ? "control" : "variation"}`
      );
    } else {
      request.nextUrl.searchParams.set("testVersion", participant);
    }
    return NextResponse.rewrite(request.nextUrl, {
      headers: new Headers({
        "Set-Cookie": `trendingPosition=${participant}; path=/; secure; HttpOnly; SameSite=None; expires=Fri, 31 Dec 9999 23:59:59 GMT; SameSite=None`,
      }),
    });
  }
  return NextResponse.rewrite(nextUrl);
}
