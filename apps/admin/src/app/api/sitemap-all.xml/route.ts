import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

import { getRootUrl } from "@/shared/getRootUrl";

const ITEMS_PER_PAGE = 30;

export const dynamic = "force-dynamic";

export async function GET() {
  const totalUsers = await prisma.author.count();
  const totalGroups = totalUsers / ITEMS_PER_PAGE;
  const lastModified = new Date().toISOString();
  let sitemaps = "";

  for (let i = 0; i < totalGroups; i++) {
    sitemaps += `<sitemap>
      <loc>${getRootUrl()}/api/sitemap-group.xml?group=${i}</loc>
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
