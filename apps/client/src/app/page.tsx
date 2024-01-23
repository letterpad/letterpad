export const runtime = 'edge';

import { getData } from '@/data';

import { SectionContainer } from '../../src/components/section';
import { withPageSEO } from '@/components/SEO';

import Creative from '@/layouts/Creative';

import Custom404 from './not-found';
import { getTheme } from '../../themes';
import { Navbar } from '../components/navbar';
import { PrismHighlight } from '../components/prism-highlight';
import { StructuredData } from '../components/structured-data';

export default async function Home() {
  const data = await getData();
  if (!data) {
    return <Custom404 homepage="https://letterpad.app" />;
  }
  const { settings, me, isPage, page, posts } = data;
  const { HomePosts, HomePage } = getTheme(settings?.theme);

  const _isPage = isPage && page?.__typename === 'Post';
  const isPosts = !isPage && posts?.__typename === 'PostsNode';
  const isSinglePage = _isPage && page.page_type === 'default';
  const isCreative = _isPage && page.page_type !== 'default';
  const isEmpty = posts?.__typename === 'PostsNode' && posts.rows.length === 0;

  const HomePageWithSEO = withPageSEO({
    Component: HomePage,
  });

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    headline: settings.site_title,
    description: settings.site_description,
    image: settings.banner?.src!,
    author: [
      {
        '@type': 'Person',
        name: me.name,
      },
    ],
    publisher: {
      '@type': 'Organization',
      name: settings.site_title,
      logo: {
        '@type': 'ImageObject',
        url: me.avatar,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${settings.site_url}`,
    },
  };
  return (
    <>
      <Navbar settings={settings} isHome={true} me={me} />
      <StructuredData data={jsonLd} />
      <div>
        <PrismHighlight />
        <SectionContainer>
          {isEmpty && (
            <span className="py-16 text-gray-400">
              Hi, my name is {me.name}!
            </span>
          )}
        </SectionContainer>
        {isPosts && <HomePosts posts={posts} settings={settings} />}
        {isSinglePage && (
          <HomePageWithSEO data={page} settings={settings} me={me}>
            <div dangerouslySetInnerHTML={{ __html: page.html ?? '' }}></div>
          </HomePageWithSEO>
        )}
        {isCreative && (
          <Creative
            data={page}
            site_name={settings.site_title}
            settings={settings}
            me={me}
          />
        )}
      </div>
    </>
  );
}
