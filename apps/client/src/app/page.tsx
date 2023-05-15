import Head from 'next/head';

import { CodeBlock } from '@/components/codeblock';
import SectionContainer from '@/components/SectionContainer';
import { BaseSEO, withPageSEO } from '@/components/SEO';

import Creative from '@/layouts/Creative';

import { getData } from '../data';
import { useTheme } from '../../themes';

export default async function Home() {
  const { settings, me, isPage, page, posts } = await getData();
  const { HomePosts, HomePage } = useTheme(settings?.theme);

  const _isPage = isPage && page?.__typename === 'Post';
  const isPosts = !isPage && posts?.__typename === 'PostsNode';
  const isSinglePage = _isPage && page.page_type === 'default';
  const isCreative = _isPage && page.page_type !== 'default';
  const isEmpty = posts?.__typename === 'PostsNode' && posts.rows.length === 0;

  const HomePageWithSEO = withPageSEO({
    Component: HomePage,
  });

  return (
    <>
      <Head>
        {settings.site_favicon?.src && (
          <link
            rel="icon"
            type="image/png"
            sizes="32x32"
            href={settings.site_favicon.src}
          />
        )}
      </Head>
      <BaseSEO
        title={settings.site_title}
        description={settings.site_description ?? ''}
        site_banner={settings.banner?.src}
        site_title={settings.site_title}
        url={settings.site_url}
        twSite={me.social?.twitter}
      />
      <div>
        <CodeBlock />
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
