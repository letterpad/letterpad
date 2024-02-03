import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { decode } from "next-auth/jwt";

import { prisma } from "@/lib/prisma";

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
    return NextResponse.redirect(
      `${process.env.ROOT_URL}/login?error=unauthorized&source=${sourceUrl}&serviceUrl=${serviceUrl}`,
      { status: 307 }
    );
  }

  if (params.action === "logout") {
    const author = await prisma.author.findFirst({
      select: { id: true },
      where: { email: decodedToken.email! },
    });
    const deleted = await prisma.session.deleteMany({
      where: {
        author_id: author?.id!,
      },
    });
    const requestHeaders = new Headers(req.headers);
    req.cookies.delete(getAuthCookieName());
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
        return NextResponse.redirect(
          process.env.ROOT_URL + "/login?error=serviceUrl_is_missing",
          { status: 302 }
        );
      }
      const cookieStore = cookies();
      const sessionToken = cookieStore.get(getAuthCookieName())?.value!;
      const author = await prisma.author.findFirst({
        select: { id: true },
        where: { email: decodedToken.email! },
      });
      const found = await prisma.session.findFirst({
        where: {
          author_id: author?.id,
          domain: new URL(serviceUrl).origin,
        },
      });
      if (found) {
        await prisma.session.update({
          where: {
            id: found.id,
          },
          data: {
            token: sessionToken,
            expiresAt: decodedToken?.exp
              ? new Date(decodedToken?.exp! as Date)
              : new Date(),
          },
        });
      } else {
        await prisma.session.create({
          data: {
            domain: new URL(serviceUrl).origin,
            token: cookieStore.get(getAuthCookieName())?.value!,
            expiresAt: decodedToken?.exp
              ? new Date(decodedToken?.exp! as Date)
              : new Date(),
            author: {
              connect: {
                id: author?.id,
              },
            },
          },
        });
      }
      if (new URL(serviceUrl).host === new URL(process.env.ROOT_URL).host) {
        return NextResponse.redirect(sourceUrl, { status: 302 });
      }
      const response = NextResponse.redirect(
        `${serviceUrl}?token=${sessionToken}&source=${sourceUrl}`,
        { status: 302 }
      );
      return response;
    } catch (e) {
      // eslint-disable-next-line no-console
      console.log(e);
      // return NextResponse.redirect("/login?error=serviceUrl is missing", { status: 307 });
    }
  }
}
