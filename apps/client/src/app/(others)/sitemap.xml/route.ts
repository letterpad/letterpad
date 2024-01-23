export const runtime = 'edge';

import { NextResponse } from 'next/server';

import { getSiteMap } from '../../../data';

export async function GET() {
  const xmlHeader = '<?xml version="1.0" encoding="UTF-8"?>';
  const urlsetStart =
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';
  const urlsetEnd = '</urlset>';
  const headers = new Headers({
    'Content-Type': 'application/xml',
  });
  let xmlData = xmlHeader + urlsetStart;

  const data = await getSiteMap();
  if (!data)
    return new NextResponse(xmlData, {
      status: 200,
      headers,
    });

  const { rows } = data;

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

  return new NextResponse(xmlData, {
    status: 200,
    headers,
  });
}
