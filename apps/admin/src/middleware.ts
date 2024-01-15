import { NextRequest, NextResponse, userAgent } from "next/server";
import { decode } from "next-auth/jwt";
export const config = { matcher: "/((?!.*\\.).*)" };

export async function middleware(request: NextRequest) {
  const { device } = userAgent(request);
  const cookie = request.cookies.get("next-auth.session-token");
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
      } else if (callbackUrl) {
        const callbackUrlHost = new URL(callbackUrl || "");
        if (host !== callbackUrlHost.host && !request.nextUrl.pathname.includes("/logout")) {
          const url = request.nextUrl;
          url.pathname = 'api/identity/login';
          url.search = "";
          url.searchParams.set("callbackUrl", callbackUrl);
          return NextResponse.rewrite(url);
        }
      }
    } catch (e) {
      // return NextResponse.redirect(ROOT_URL + "/login");
    }
  }

  const viewport = device.type === "mobile" ? "mobile" : "desktop";
  const nextUrl = request.nextUrl;
  nextUrl.searchParams.set("viewport", viewport);

  return NextResponse.rewrite(nextUrl);
}
