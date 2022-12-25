import { Letterpad } from 'letterpad-sdk';

const Sitemap = () => {
  return <div></div>;
};

export const getServerSideProps = async (context) => {
  const letterpad = new Letterpad({
    letterpadServer: {
      url: process.env.API_URL!,
      token: process.env.CLIENT_ID!,
      host: context.req.headers.host,
    },
  });

  const sitemapResponse = await letterpad.getSitemap();

  if (sitemapResponse.__typename === 'SiteMapList') {
    const items = sitemapResponse.rows.map((row) => {
      return `
            <url>
              <loc>${row.route}</loc>
              <lastmod>${row.lastmod}</lastmod>
            </url>
        `;
    });
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      ${items.join()}
    </urlset>
  `;

    context.res.setHeader('Content-Type', 'text/xml');
    context.res.write(sitemap);
    context.res.end();
  }

  return {
    props: {},
  };
};

export default Sitemap;
