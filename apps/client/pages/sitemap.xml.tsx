import gql from 'graphql-tag';
import { sitemapFragment } from 'queries/queries';

import { fetchProps } from '@/lib/client';
import { SitemapQueryQuery, SitemapQueryQueryVariables } from '@/lib/graphql';

export const sitemapQuery = gql`
  query SitemapQuery {
    sitemap {
      ...sitemapFragment
    }
  }
  ${sitemapFragment}
`;

const Sitemap = () => {
  return <div>Hello</div>;
};

export const getServerSideProps = async (context) => {
  const response = await fetchProps<SitemapQueryQuery, SitemapQueryQueryVariables>(
    sitemapQuery,
    {},
    context.req.headers.host
  );

  if (response.props.data.sitemap.__typename === 'SiteMapList') {
    const items = response.props.data.sitemap.rows.map((row) => {
      return `
            <url>
              <loc>${row.route}</loc>
              <lastmod>${row.lastmod}</lastmod>
              <changefreq>monthly</changefreq>
              <priority>${row.priority}</priority>
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
