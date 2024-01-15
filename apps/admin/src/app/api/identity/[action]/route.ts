import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "../../../../graphql/context";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, { params }: { params: { action: string } }) {
  const callbackUrl = req.nextUrl.searchParams.get("callbackUrl")!;
  const session = await getServerSession({ req });

  if (params.action === "logout") {
    const sessions = await prisma.session.findMany({
      where: {
        author_id: session?.user?.id!,
      },
    });

    const urls = sessions.map((session) => `${session.domain}/api/identity/logout?origin=${callbackUrl}`).join("&next=");
    return NextResponse.redirect(urls, { status: 307 });
  }


  if (params.action === "login") {
    try {
      if (!callbackUrl) {
        return NextResponse.redirect(process.env.ROOT_URL + "/login?error=callbackUrl_is_missing", { status: 307 });
      }
      const cookieStore = cookies();

      const token = await getToken({
        req: req as any,
        secret: process.env.SECRET_KEY,
      });
      /**
        const headers = new Headers();
        headers.append('set-cookie', `__Secure-next-auth.session-token=${cookieStore.get("__Secure-next-auth.session-token")?.value!}; SameSite=None; Secure; HttpOnly; Max-Age=60*60*24`);
        headers.append('location', callbackUrl);
        return new Response(undefined, { status: 307, headers });
      */
      const sessionToken = cookieStore.get("__Secure-next-auth.session-token")?.value!;
      const found = await prisma.session.findFirst({
        where: {
          author_id: session?.user?.id!,
          domain: new URL(callbackUrl).origin,
        },
      });
      if (found) {
        if (found.token !== sessionToken) {
          await prisma.session.update({
            where: {
              id: found.id,
            },
            data: {
              token: sessionToken,
              expiresAt: new Date(token?.exp! as Date),
            },
          });
        }
      } else {
        await prisma.session.create({
          data: {
            domain: new URL(callbackUrl).origin,
            token: cookieStore.get("__Secure-next-auth.session-token")?.value!,
            expiresAt: new Date(token?.exp! as Date),
            author: {
              connect: {
                id: session?.user?.id!,
              },
            },
          },
        });
      }
      const response = NextResponse.redirect(`${callbackUrl}?token=${sessionToken}`, { status: 302 });
      response.cookies.set("__Secure-next-auth.session-token", sessionToken);
      return response;
    } catch (e) {
      console.log(e);
      // return NextResponse.redirect("/login?error=callbackUrl is missing", { status: 307 });
    }
  }
}
