import { ReadonlyHeaders } from "next/dist/server/web/spec-extension/adapters/headers";
import { NextRequest, NextResponse, userAgent } from "next/server";

import { basePath, registrationPaths } from "./constants";
import { Session } from "./graphql/types";
import { RegisterStep } from "../__generated__/__types__";

export const config = {
  /*
   * The way you configure your matcher items depend on your route structure.
   * E.g. if you decide to put all your posts under `/posts/[postSlug]`,
   * you'll need to add an extra matcher item "/posts/:path*".
   * The reason we do this is to prevent the middleware from matching absolute paths
   * like "demo.vercel.pub/_sites/steven" and have the content from `steven` be served.
   *
   * Here's a breakdown of each matcher item:
   * 1. "/"               - Matches the root path of the site.
   * 2. "/([^/.]*)"       - Matches all first-level paths (e.g. demo.vercel.pub/platforms-starter-kit)
   *                        but exclude `/public` files by excluding paths containing `.` (e.g. /logo.png)
   * 3. "/site/:path*"    – for app.vercel.pub/site/[siteId]
   * 4. "/post/:path*"    – for app.vercel.pub/post/[postId]
   * 5. "/_sites/:path*"  – for all custom hostnames under the `/_sites/[site]*` dynamic route (demo.vercel.pub, platformize.co)
   *                        we do this to make sure "demo.vercel.pub/_sites/steven" is not matched and throws a 404.
   */
  matcher: [
    "/update/(profile-info|site-info)",
    "/post/:path*",
    "/home",
    "/posts",
    "/creatives",
    "/media",
    "/tags",
    "/profile",
    "/themes",
    "/domain-mapping",
    "/settings",
    "/subscribers",
    "/logout",
  ],
};

const { ProfileInfo, SiteInfo, Registered } = RegisterStep;

export async function middleware(request: NextRequest) {
  const { device } = userAgent(request);
  const session = await getServerSession(request.headers);
  const viewport = device.type === "mobile" ? "mobile" : "desktop";
  const nextUrl = request.nextUrl;
  nextUrl.searchParams.set("viewport", viewport);
  nextUrl.searchParams.set("session", JSON.stringify(session));
  const proto = request.headers.get("x-forwarded-proto");
  const host = request.headers.get("host");

  if (!session?.user.id) {
    return NextResponse.redirect(proto + "://" + host + "/login");
  } else if (session?.user?.register_step) {
    const { register_step } = session?.user;
    const { pathname } = request.nextUrl;

    switch (register_step) {
      case ProfileInfo:
        if (pathname !== registrationPaths[ProfileInfo]) {
          return NextResponse.redirect(
            proto + "://" + host + registrationPaths[ProfileInfo]
          );
        }
        break;

      case SiteInfo:
        if (pathname !== registrationPaths[SiteInfo]) {
          return NextResponse.redirect(
            proto + "://" + host + registrationPaths[SiteInfo]
          );
        }
        break;
      case Registered:
        if (
          pathname === registrationPaths[SiteInfo] ||
          pathname === registrationPaths[ProfileInfo]
        ) {
          return NextResponse.redirect(
            proto + "://" + host + registrationPaths[Registered]
          );
        }
      default:
        break;
    }
  }

  return NextResponse.rewrite(nextUrl);
}

export const getServerSession = async (
  headers: ReadonlyHeaders
): Promise<{ user: Session } | null> => {
  try {
    const sessionURL =
      (headers.get("origin") ?? `http://${headers.get("host")}`) +
      basePath +
      "/api/auth/session";
    const cookie = headers.get("cookie");
    if (!cookie) return null;
    const res = await fetch(sessionURL, {
      headers: { cookie },
    });
    const session = await res.json();
    return session.user ? session : null;
  } catch (e) {
    return null;
    // this means the session is not set. This request is probably coming from client and not admin.
    // client will never have a session.
    // It will use authorization header to get the author id or subdmomain name to // get the authorID
  }
};
