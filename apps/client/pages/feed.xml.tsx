import gql from 'graphql-tag';
import { feedFragment, meFragment, settingsFragment } from 'queries/queries';

import { fetchProps } from '@/lib/client';
import { FeedQueryQuery, FeedQueryQueryVariables } from '@/lib/graphql';

export const feedQuery = gql`
  query FeedQuery {
    feed {
      ...feedFragment
    }
    ...me
    ...settings
  }
  ${feedFragment}
  ${meFragment}
  ${settingsFragment}
`;

const Feed = () => {
  return <div>Hello</div>;
};

export const getServerSideProps = async (context) => {
  const response = await fetchProps<FeedQueryQuery, FeedQueryQueryVariables>(
    feedQuery,
    {},
    context.req.headers.host
  );
  if (response.props.data.me?.__typename !== 'Author')
    return {
      props: {},
    };
  if (response.props.data.settings?.__typename !== 'Setting')
    return {
      props: {},
    };
  if (response.props.data.feed.__typename === 'Feed') {
    const items = response.props.data.feed.rows.map((row) => {
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
    const { me, settings } = response.props.data;
    const feed = `<rss xmlns:atom="http://www.w3.org/2005/Atom" version="2.0">
    <channel xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      <title>${settings.site_title}</title>
      <link>${settings.site_url}</link>
      <description>${settings.site_description}</description>
      <language>en-us</language>
      <managingEditor>${settings.site_email} (${me.name})</managingEditor>
      <webMaster>${settings.site_email} (${me.name})</webMaster>
      <lastBuildDate>Thu, 15 Dec 2022 00:00:00 GMT</lastBuildDate>
      <atom:link href="${settings.site_url}/feed.xml" rel="self" type="application/rss+xml"/>
      ${items.join('')}
    </channel></rss>`;

    context.res.setHeader('Content-Type', 'text/xml');
    context.res.write(feed);
    context.res.end();
  }

  return {
    props: {},
  };
};

export default Feed;
