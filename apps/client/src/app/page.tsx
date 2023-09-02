import { Metadata } from 'next';
import Head from 'next/head';

import { getData } from '@/data';

import { CodeBlock } from '@/components/codeblock';
import SectionContainer from '@/components/SectionContainer';
import { withPageSEO } from '@/components/SEO';

import Creative from '@/layouts/Creative';

import StructuredData from '../../components/StructuredData';
import { useTheme } from '../../themes';

export const dynamic = 'force-dynamic';

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
      <StructuredData data={jsonLd} />
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

export async function generateMetadata({
  params,
  searchParams,
}): Promise<Metadata> {
  const { settings, me } = await getData();
  return {
    title: settings.site_title,
    description: settings.site_description ?? '',
    twitter: {
      title: settings.site_title,
      images: [
        {
          url: settings.banner?.src!,
          width: settings.banner?.width,
          height: settings.banner?.height,
          alt: settings.site_title,
        },
      ],
      card: 'summary_large_image',
      description: settings.site_description,
    },
    openGraph: {
      url: settings.site_url,
      title: settings.site_title,
      description: settings.site_description,
      authors: [me.name],
      firstName: me.name,
      siteName: settings.site_title,
      images: [
        {
          url: settings.banner?.src!,
          width: 800,
          height: 600,
          alt: settings.site_title,
        },
      ],
    },
  };
}
