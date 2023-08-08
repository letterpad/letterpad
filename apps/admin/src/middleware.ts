import { NextRequest, NextResponse, userAgent } from "next/server";

import { basePath } from "./constants";

export async function middleware(request: NextRequest) {
  const { device } = userAgent(request);
  const session = await getServerSession({ req: request });
  const viewport = device.type === "mobile" ? "mobile" : "desktop";
  request.nextUrl.searchParams.set("viewport", viewport);
  request.nextUrl.searchParams.set("session", session);
  return NextResponse.rewrite(request.nextUrl);
}

export const getServerSession = async (context) => {
  try {
    const sessionURL =
      (context.req.headers.get("origin") ??
        `http://${context.req.headers.get("host")}`) +
      basePath +
      "/api/auth/session";
    const res = await fetch(sessionURL, {
      headers: { cookie: context.req.headers.get("cookie") },
    });
    const session = await res.json();
    return session.user ? session : null;
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log("Error in getServerSession");
    // this means the session is not set. This request is probably coming from client and not admin.
    // client will never have a session.
    // It will use authorization header to get the author id or subdmomain name to // get the authorID
  }
};
