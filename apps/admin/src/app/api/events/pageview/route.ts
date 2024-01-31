export const runtime = "edge";

import { headers } from "next/headers";
import { NextResponse } from "next/server";

import { getKeyForViews, incrementPageViews } from "@/lib/redis";

export async function GET(req: Request) {
  try {
    const head = headers();
    const params = new URL(req.url).searchParams;
    const id = params.get("id");
    const type = params.get("type");

    let ipAddress = head.get("x-real-ip") as string;

    const forwardedFor = head.get("x-forwarded-for") as string;
    if (!ipAddress && forwardedFor) {
      ipAddress = forwardedFor?.split(",").at(0) ?? "Unknown";
    }
    const data = {
      ok: true,
    };

    if (ipAddress && type && id) {
      await incrementPageViews(getKeyForViews(type, id), ipAddress);
      return NextResponse.json(data, { status: 200 });
    }

    data.ok = false;
    return NextResponse.json(data, { status: 400 });
  } catch (e) {
    //@ts-ignore
    return NextResponse.json(
      { ok: false, message: e.message },
      { status: 400 }
    );
  }
}
