import { getData } from '../../../data';

export async function GET() {
  const data = await getData();

  const robots = `User-agent: *
Allow: /
Disallow: /cdn-cgi/
Sitemap: ${data?.settings.site_url}/sitemap.xml`;

  return new Response(robots, {
    headers: { 'Content-Type': 'text/plain' },
  });
}
