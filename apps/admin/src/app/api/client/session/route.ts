import { NextResponse } from "next/server";
import { getServerSession } from "@/graphql/context";
import { prisma } from "@/lib/prisma";
import { getAuthCookieName } from "@/utils/authCookie";

export async function GET(request: Request) {
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
        const headers = new Headers();
        headers.set('set-cookie', `${getAuthCookieName()}=; SameSite=None; Secure; Max-Age=0`);
        return NextResponse.json({}, { status: 200 });
    }
    return NextResponse.json(session, { status: 200 });
}
