import { NextRequest, NextResponse, userAgent } from "next/server";
import { decode } from "next-auth/jwt";
import { getAuthCookieName } from "./utils/authCookie";

export const config = { matcher: "/((?!.*\\.).*)" };

export async function middleware(request: NextRequest) {
  const cookie = request.cookies.get(getAuthCookieName());
  const proto = request.headers.get("x-forwarded-proto");
  const host = request.headers.get("host");
  const source = new URL(request.url).searchParams.get("source");

  if (!process.env.SECRET_KEY) {
    throw new Error(
      "You have not setup the variable SECRET_KEY in `apps/admin/.env`. If you do not have this `.env` file, you can copy it from `apps/admin/.env.sample`. Set its value to a secret string."
    );
  }
  const ROOT_URL = proto + "://" + host;

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
  user?: any
}
function handleAuth({ request, source, user }: Props) {
  console.log("Root", process.env.ROOT_URL)
  const sourceURL = new URL(source);
  console.log("sourceURL", sourceURL.href)
  const callback = new URL(`${sourceURL.protocol}//${sourceURL.host}`);
  console.log("callback", callback.href)
  const adminURL = new URL(process.env.ROOT_URL);
  console.log("adminURL", adminURL.href)
  const url = request.nextUrl;
  const isLogin = url.pathname === "/api/identity/login";
  const isLogout = url.pathname === "/api/identity/logout";


  if (adminURL.host !== callback.host) {
    if (!url.searchParams.get("serviceUrl")) {
      const requestHeaders = new Headers();
      url.searchParams.set("source", source);
      if (isLogin) {
        url.pathname = 'api/identity/login';
        url.searchParams.set("serviceUrl", `${callback.href}api/identity/login`);
      }
      if (isLogout) {
        url.pathname = 'api/identity/logout';
        url.searchParams.set("serviceUrl", `${callback.href}api/identity/logout`);
      }
      return NextResponse.redirect(url, { headers: requestHeaders });
    }
  }
}