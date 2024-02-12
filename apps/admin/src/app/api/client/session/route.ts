import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { decode } from "next-auth/jwt";

import { prisma } from "@/lib/prisma";

import { getAuthCookieName } from "@/utils/authCookie";

export async function GET(request: Request) {
  const hasToken = cookies().get(getAuthCookieName());
  if (!hasToken) {
    return NextResponse.json(null, { status: 200 });
  }
  try {
    const session = await decode({
      token: hasToken.value,
      secret: process.env.SECRET_KEY,
    });
    const author = await prisma.author.findFirst({
      select: { id: true },
      where: { email: session?.email! },
    });
    const siteUrl = request.headers.get("siteurl")!;
    const found = await prisma.session
      .findFirst({
        where: {
          author_id: author?.id,
          domain: siteUrl,
        },
      })
      .catch(() => null);
    if (!found) {
      return NextResponse.json(null, { status: 200 });
    }
    const user = await prisma.author.findFirst({
      select: {
        name: true,
        avatar: true,
        username: true,
      },
      where: {
        id: author?.id,
      },
    });
    return NextResponse.json({ user }, { status: 200 });
  } catch (e) {
    return NextResponse.json(null, { status: 501 });
  }
}
