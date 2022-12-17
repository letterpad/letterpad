import { createApolloServerClient } from "@/graphql/apolloServerClient";
import {
  SitemapsDocument,
  SitemapsQuery,
} from "@/__generated__/queries/queries.graphql";

const Sitemap = () => {
  return <div>Hello</div>;
};

export const getServerSideProps = async (context) => {
  const apollo = await createApolloServerClient(context);
  const response = await apollo.query<SitemapsQuery>({
    query: SitemapsDocument,
  });

  if (response.data.sitemaps.__typename === "SiteMapList") {
    const items = response.data.sitemaps.rows.map((row) => {
      return `
            <url>
              <loc>${row.route}</loc>
              <lastmod>${row.lastmod}</lastmod>
              <changefreq>daily</changefreq>
              <priority>${row.priority}</priority>
            </url>
        `;
    });
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      ${items.join()}
    </urlset>
  `;

    context.res.setHeader("Content-Type", "text/xml");
    context.res.write(sitemap);
    context.res.end();
  }

  return {
    props: {},
  };
};

export default Sitemap;
