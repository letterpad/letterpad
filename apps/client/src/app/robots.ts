import { MetadataRoute } from 'next';

import { getData } from '../data';

export default async function robots(): Promise<MetadataRoute.Robots> {
  const data = await getData();
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: '/cdn-cgi/',
    },
    sitemap: `${data?.settings.site_url}/sitemap.xml`,
  };
}
