import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  let metrics = await prisma.$metrics.json();
  return new NextResponse(JSON.stringify(metrics.counters, null, 2), {
    status: 200,
  });
}
