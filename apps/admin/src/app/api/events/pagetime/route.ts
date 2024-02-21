// export const runtime = "edge";

import { headers } from "next/headers";
import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const head = headers();
  const params = new URL(req.url).searchParams;
  const id = params.get("id");
  const type = params.get("type");
  const time = params.get("time");

  let ipAddress = head.get("x-real-ip") as string;

  const forwardedFor = head.get("x-forwarded-for") as string;
  if (!ipAddress && forwardedFor) {
    ipAddress = forwardedFor?.split(",").at(0) ?? "Unknown";
  }

  if (ipAddress && type && id) {

    const log = await prisma.pageTimeLog.findUnique({
      select: {
        updatedAt: true,
        snapshot: true,
      },
      where: {
        ip_post_id: {
          ip: ipAddress,
          post_id: Number(id)
        },
      }
    });
    if (log && log.updatedAt) {
      if (isMinsAgo(log.updatedAt, 20)) {
        return NextResponse.json({ continue: false }, { status: 200 });
      }
    }
    await prisma.pageTimeLog.upsert({
      create: {
        ip: ipAddress,
        snapshot: `${time}`,
        post: {
          connect: {
            id: Number(id)
          }
        }
      },
      update: {
        snapshot: `${log?.snapshot},${time}`
      },
      where: {
        ip_post_id: {
          ip: ipAddress,
          post_id: Number(id)
        }
      }
    })
    return NextResponse.json({ continue: true }, { status: 200 });
  }
  return NextResponse.json({ continue: false }, { status: 400 });
}


function isMinsAgo(date: Date, ago: number) {
  const diff = new Date(new Date().toUTCString()).getTime() - new Date(date).getTime();
  const minutes = Math.ceil(diff / 60000);

  return (minutes > ago)
}