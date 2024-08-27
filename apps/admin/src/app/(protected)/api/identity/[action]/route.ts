import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { decode } from "next-auth/jwt";

import { getLoginUrl, getRootUrl } from "@/shared/getRootUrl";
import { getAuthCookieName } from "@/utils/authCookie";

export async function GET(
  req: NextRequest,
  { params }: { params: { action: string } }
) {
  const sourceUrl = req.nextUrl.searchParams.get("source") ?? "";
  const serviceUrl = req.nextUrl.searchParams.get("serviceUrl") ?? "";
  const decodedToken = await decode({
    token: req.cookies.get(getAuthCookieName())?.value!,
    secret: process.env.SECRET_KEY,
  });
  if (!decodedToken && params.action === "logout") {
    return NextResponse.redirect(`${serviceUrl}?source=${sourceUrl}`, {
      status: 302,
    });
  }

  if (!decodedToken) {
    const url = new URL(getLoginUrl());
    url.searchParams.append("error", "unauthorized");
    url.searchParams.append("source", sourceUrl);
    url.searchParams.append("serviceUrl", serviceUrl);

    return NextResponse.redirect(url.href, { status: 307 });
  }

  if (params.action === "logout") {
    const requestHeaders = new Headers(req.headers);
    req.cookies.delete(getAuthCookieName());
    requestHeaders.delete("cookie");
    requestHeaders.set(
      "set-cookie",
      `${getAuthCookieName()}=; Max-Age=-1; path=/; secure;`
    );
    const response = NextResponse.redirect(
      `${serviceUrl}?source=${sourceUrl}`,
      { status: 302, headers: requestHeaders }
    );
    return response;
  }

  if (params.action === "login") {
    try {
      if (!serviceUrl) {
        const url = new URL(getLoginUrl());
        url.searchParams.append("error", "serviceUrl_is_missing");
        return NextResponse.redirect(url.href, { status: 302 });
      }
      const cookieStore = cookies();
      const sessionToken = cookieStore.get(getAuthCookieName())?.value!;
      if (new URL(serviceUrl).host === new URL(getRootUrl()).host) {
        return NextResponse.redirect(sourceUrl, { status: 302 });
      }
      const src = new URL(serviceUrl);
      src.searchParams.append("token", sessionToken);
      src.searchParams.append("source", sourceUrl);
      const response = NextResponse.redirect(src.href, { status: 302 });
      return response;
    } catch (e) {
      // eslint-disable-next-line no-console
      console.log(e);
      // return NextResponse.redirect("/login?error=serviceUrl is missing", { status: 307 });
    }
  }
}
