import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

const ITEMS_PER_PAGE = 30;

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const group = searchParams.get("group");
  if (!group) {
    return new NextResponse("Group not found", {
      status: 501,
    });
  }
  const skip = Number(group) * ITEMS_PER_PAGE;
  const take = skip + ITEMS_PER_PAGE;

  const usernames = await prisma.author.findMany({
    skip,
    take,
    select: {
      username: true,
    },
  });

  let sitemaps = "";
  const lastModified = new Date().toISOString();
  for (let i = 0; i < usernames.length; i++) {
    sitemaps += `<sitemap>
      <loc>https://${usernames[i].username}.letterpad.app/sitemap.xml</loc>
      <lastmod>${lastModified}</lastmod>
    </sitemap>`;
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
    <sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    ${sitemaps}
  </sitemapindex>
  `;
  const headers = new Headers({
    "Content-Type": "application/xml",
  });

  return new NextResponse(xml, {
    status: 200,
    headers,
  });
}
