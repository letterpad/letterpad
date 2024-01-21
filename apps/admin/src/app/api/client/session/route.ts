import { NextResponse } from "next/server";
// import { getServerSession } from "@/graphql/context";
import { prisma } from "@/lib/prisma";
import { cookies } from 'next/headers'
import { getAuthCookieName } from "@/utils/authCookie";
import { decode } from "next-auth/jwt";

export async function GET(request: Request) {
    const hasToken = cookies().get(getAuthCookieName());
    if (!hasToken) {
        return NextResponse.json(null, { status: 200 });
    }
    try {
        const session = await decode({ token: hasToken.value, secret: process.env.SECRET_KEY })
        const siteUrl = request.headers.get('siteurl')!;
        const found = await prisma.session.findFirst({
            where: {
                author_id: Number(session?.sub) ?? 0,
                domain: siteUrl,
            },
        });
        if (!found) {
            return NextResponse.json(null, { status: 200 });
        }
        return NextResponse.json(session, { status: 200 });
    } catch (e) {
        return NextResponse.json(null, { status: 501 });
    }
}
