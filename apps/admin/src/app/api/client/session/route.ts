import { NextResponse } from "next/server";
import { getServerSession } from "@/graphql/context";
import { prisma } from "@/lib/prisma";
import { cookies } from 'next/headers'
import { getAuthCookieName } from "../../../../utils/authCookie";

export async function GET(request: Request) {
    const hasToken = cookies().get(getAuthCookieName());
    if (!hasToken) {
        console.log("no token")
        return NextResponse.json({}, { status: 200 });
    }
    const session = await getServerSession({ req: request as any });
    const siteUrl = request.headers.get('siteurl')!;
    const found = await prisma.session.findFirst({
        where: {
            author_id: session?.user?.id ?? 0,
            domain: siteUrl,
        },
    });
    console.log(`siteURL from client session: ${request.headers.get('siteurl')!},  session: ${session}, found: ${found}`)
    if (!found) {
        return NextResponse.json({}, { status: 200 });
    }
    return NextResponse.json(session, { status: 200 });
}
