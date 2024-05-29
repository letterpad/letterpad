import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { decode } from "next-auth/jwt";

import { prisma } from "@/lib/prisma";

import { getAuthCookieName } from "@/utils/authCookie";

export async function GET() {
  const hasToken = cookies().get(getAuthCookieName());
  if (!hasToken) {
    return NextResponse.json(null, { status: 200 });
  }
  try {
    // todo: check if this works
    const session = await decode({
      token: hasToken.value,
      secret: process.env.SECRET_KEY,
    });
    // prisma.session.findFirst({ where: { sessionToken: "" } })
    const author = await prisma.author.findFirst({
      select: { id: true },
      where: { email: session?.email! },
    });
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
