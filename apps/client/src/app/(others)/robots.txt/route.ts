import { getSettingsData } from '../../../data';

export async function GET() {
  const data = await getSettingsData();

  const robots = `User-agent: *
Allow: /
Disallow: /cdn-cgi/
Sitemap: ${data?.site_url}/sitemap.xml`;

  return new Response(robots, {
    headers: { 'Content-Type': 'text/plain' },
  });
}
