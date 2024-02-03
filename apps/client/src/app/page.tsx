export const runtime = 'edge';

import { getData } from '@/data';

import Creative from '@/layouts/Creative';

import Custom404 from './not-found';
import { Navbar } from '../components/navbar';
import { PageView } from '../components/pageView';
import { PrismHighlight } from '../components/prism-highlight';
import { StructuredData } from '../components/structured-data';
import { getApiRootUrl } from '../../lib/utils/url';
import { SectionContainer } from '../../src/components/section';
import { getTheme } from '../../themes';

export default async function Home() {
  const data = await getData();
  if (!data) {
    return <Custom404 />;
  }
  const { settings, me, isPage, page, posts } = data;
  const { HomePosts } = getTheme(settings?.theme);

  const _isPage = isPage && page?.__typename === 'Post';
  const isPosts = !isPage && posts?.__typename === 'PostsNode';
  const isSinglePage = _isPage && page.page_type === 'default';
  const isCreative = _isPage && page.page_type !== 'default';
  const isEmpty = posts?.__typename === 'PostsNode' && posts.rows.length === 0;

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
          <div dangerouslySetInnerHTML={{ __html: page.html ?? '' }}></div>
        )}
        {isCreative && (
          <Creative
            data={page}
            site_name={settings.site_title}
            settings={settings}
            me={me}
          />
        )}
        <AboutMe me={me} />
        <PageView type="home" id={me.username} />
      </div>
    </>
  );
}

const AboutMe = ({ me }) => {
  return (
    <div className="rounded text-center text-gray-500 p-8 md:px-0 dark:bg-slate-900 bg-slate-100 shadow-inner">
      <img
        className="w-32 h-32 rounded-full mx-auto p-4 border-4 object-cover"
        src={me.avatar}
        alt={me.name}
      />
      <div className="mt-5">
        <a
          href={new URL(`@${me.username}`, getApiRootUrl()).href}
          className="text-2xl font-bold leading-none text-gray-900 dark:text-gray-300 transition duration-500 ease-in-out"
        >
          {me.name}
        </a>
        <p>{me.occupation}</p>
      </div>

      <p className="mt-2 text-sm text-gray-900">{me.signature}</p>
    </div>
  );
};
