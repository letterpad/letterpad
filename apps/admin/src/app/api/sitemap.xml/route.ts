import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  const lastModified = new Date().toISOString();

  const usernames = await prisma.author.findMany({
    select: {
      username: true,
    },
  });

  let sitemaps = "";
  usernames.forEach(({ username }) => {
    if (isAlphaNumericWithUnderscore(username)) {
      sitemaps += `<sitemap>
      <loc>https://${username}.letterpad.app/sitemap.xml</loc>
      <lastmod>${lastModified}</lastmod>
      </sitemap>`;
    }
  });

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

function isAlphaNumericWithUnderscore(str: string) {
  // Regular expression to match alphanumeric characters and underscores
  var regex = /^[a-zA-Z0-9_]+$/;

  // Test the string against the regular expression
  return regex.test(str);
}
