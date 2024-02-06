import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

export async function GET() {
  const usernames = await prisma.author.findMany({
    select: {
      username: true,
      updatedAt: true,
    },
  });

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    ${usernames
      .map(({ username, updatedAt }) => {
        return `<url>
        <loc>https://letterpad.app/@${username}</loc>
        <lastmod>${updatedAt}</lastmod>
        </url>`;
      })
      .join("")}
  </urlset>
`;
  const headers = new Headers({
    "Content-Type": "application/xml",
  });

  return new NextResponse(xml, {
    status: 200,
    headers,
  });
}
