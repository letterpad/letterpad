import { NextRequest, NextResponse } from "next/server";
import { decode } from "next-auth/jwt";

import { getAuthCookieName } from "./utils/authCookie";

export const config = { matcher: "/((?!.*\\.).*)" };

const isPlatform = process.env.NEXT_PUBLIC_LETTERPAD_PLATFORM;

export async function middleware(request: NextRequest) {
  const cookie = request.cookies.get(getAuthCookieName());
  const proto = request.headers.get("x-forwarded-proto");
  const host = request.headers.get("host");
  const source = new URL(request.url).searchParams.get("source");
  const ROOT_URL = proto + "://" + host;

  if (request.nextUrl.pathname === "/" && !isPlatform) {
    return NextResponse.redirect(ROOT_URL + "/login");
  }
  if (!process.env.SECRET_KEY) {
    throw new Error(
      "You have not setup the variable SECRET_KEY in `apps/admin/.env`. If you do not have this `.env` file, you can copy it from `apps/admin/.env.sample`. Set its value to a secret string."
    );
  }

  if (cookie?.value) {
    try {
      const user = await decode({
        token: cookie.value,
        secret: process.env.SECRET_KEY,
      });
      if (!user?.email) {
        return NextResponse.redirect(ROOT_URL + "/login");
      }
    } catch (e) {
      // return NextResponse.redirect(ROOT_URL + "/login");
    }

    if (request.nextUrl.pathname === "/posts") {
      const isPricing = request.cookies.get('loginRedirect')?.value === "pricing";
      if (isPricing) {
        return NextResponse.redirect(ROOT_URL + "/membership", {
          headers: new Headers({ "Set-Cookie": "loginRedirect=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT" })
        })
      }
    }
  }
  if (source) {
    return handleAuth({ request, source });
  }
  const nextUrl = request.nextUrl;
  return NextResponse.rewrite(nextUrl);

}

interface Props {
  request: NextRequest;
  source: string;
  user?: any;
}
function handleAuth({ request, source }: Props) {
  const sourceURL = new URL(source);
  const callback = new URL(`${sourceURL.protocol}//${sourceURL.host}`);
  const adminURL = new URL(process.env.ROOT_URL!);
  const url = request.nextUrl;
  const isLogin = url.pathname === "/api/identity/login";
  const isLogout = url.pathname === "/api/identity/logout";

  if (adminURL.host !== callback.host) {
    if (!url.searchParams.get("serviceUrl")) {
      const requestHeaders = new Headers();
      url.searchParams.set("source", source);
      if (isLogin) {
        url.pathname = "api/identity/login";
        url.searchParams.set(
          "serviceUrl",
          `${callback.href}api/identity/login`
        );
      }
      if (isLogout) {
        url.pathname = "api/identity/logout";
        url.searchParams.set(
          "serviceUrl",
          `${callback.href}api/identity/logout`
        );
      }
      return NextResponse.redirect(url, { headers: requestHeaders });
    }
  }
}
