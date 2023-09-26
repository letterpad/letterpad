export const runtime = 'edge';

import { NextResponse } from 'next/server';

import { getSiteMap } from '../../data';

export async function GET() {
  const { rows } = await getSiteMap();
  const xmlHeader = '<?xml version="1.0" encoding="UTF-8"?>';
  const urlsetStart =
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';
  const urlsetEnd = '</urlset>';

  let xmlData = xmlHeader + urlsetStart;

  rows.forEach((item) => {
    xmlData += `
    <url>
      <loc>${item.route}</loc>
      <priority>${item.priority}</priority>
      <lastmod>${item.lastmod}</lastmod>
    </url>
  `;
  });

  xmlData += urlsetEnd;
  const headers = new Headers({
    'Content-Type': 'application/xml',
  });

  return new NextResponse(xmlData, {
    status: 200,
    headers,
  });
}
