import { Letterpad } from 'letterpad-sdk';

const Feed = () => {
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

  const feedResponse = await letterpad.getFeed();
  const me = await letterpad.getAuthor();
  const settings = await letterpad.getSettings();

  const items = feedResponse.rows.map((row) => {
    const categoryStr = row.categories
      .map((category) => `<category>${category}</category>`)
      .join('');
    return `<item>
              <title>${row.title}</title>
              <guid>${row.guid}</guid>
              <description>${row.description}</description>
              <pubDate>${row.pubDate}</pubDate>
              <author>${row.author}</author>
              ${categoryStr}
            </item>
        `;
  });
  const feed = `<rss xmlns:atom="http://www.w3.org/2005/Atom" version="2.0">
    <channel xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      <title>${settings.site_title}</title>
      <link>${settings.site_url}</link>
      <description>${settings.site_description}</description>
      <language>en-us</language>
      <managingEditor>${settings.site_email} (${me.name})</managingEditor>
      <webMaster>${settings.site_email} (${me.name})</webMaster>
      <lastBuildDate>Thu, 15 Dec 2022 00:00:00 GMT</lastBuildDate>
      <atom:link href="${
        settings.site_url
      }/feed.xml" rel="self" type="application/rss+xml"/>
      ${items.join('')}
    </channel></rss>`;

  context.res.setHeader('Content-Type', 'text/xml');
  context.res.write(feed);
  context.res.end();

  return {
    props: {},
  };
};

export default Feed;
