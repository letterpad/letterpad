// export const runtime = 'edge';

import { Metadata } from 'next';

import kebabCase from '@/lib/utils/kebabCase';

import { getData, getTagsData } from '@/data';

import Link from '@/components/Link';

import Custom404 from '../../not-found';
import { SectionContainer } from '../../../components/section';
import { PageTitle } from '../../../components/title';

export async function generateMetadata(): Promise<Metadata> {
  try {
    const data = await getData();
    if (!data) return {};
    const { settings, me } = data;
    const description =
      settings.site_description ?? settings.site_tagline ?? '';
    return {
      metadataBase: new URL(settings.site_url),
      title: {
        default: 'Topics I blog about',
        template: `%s | by ${me.name}`,
      },
      description,
      icons: {
        icon: [
          {
            url: '/static/favicons/favicon-16x16.png',
            sizes: '16x16',
            rel: 'icon',
            type: 'image/png',
          },
          {
            url: '/static/favicons/favicon-32x32.png',
            sizes: '32x32',
            rel: 'icon',
            type: 'image/png',
          },
          {
            url: '/static/favicons/favicon-96x96.png',
            sizes: '96x96',
            rel: 'icon',
            type: 'image/png',
          },
        ],
        shortcut: '/favicon/favicon-16x16.png',
        apple: [
          {
            url: '/static/favicons/apple-touch-icon-60x60.png',
            sizes: '60x60',
            rel: 'apple-touch-icon-precomposed',
            type: 'image/png',
          },
          {
            url: '/static/favicons/apple-touch-icon-76x76.png',
            sizes: '76x76',
            rel: 'apple-touch-icon-precomposed',
            type: 'image/png',
          },
          {
            url: '/static/favicons/apple-touch-icon-120x120.png',
            sizes: '120x120',
            rel: 'apple-touch-icon-precomposed',
            type: 'image/png',
          },
          {
            url: '/static/favicons/apple-touch-icon-152x152.png',
            sizes: '152x152',
            rel: 'apple-touch-icon-precomposed',
            type: 'image/png',
          },
        ],
      },
      robots: { index: true, follow: true },

      twitter: {
        title: settings.site_title!,
        images: [
          {
            url: settings.banner?.src!,
            width: settings.banner?.width!,
            height: settings.banner?.height!,
            alt: settings.site_title!,
          },
        ],
        card: 'summary_large_image',
        description,
      },
      alternates: {
        canonical: settings.site_url,
        types: {
          'application/rss+xml': settings.site_url + '/feed.xml',
        },
      },
      generator: 'Letterpad',
      authors: [{ name: me.name! }],
      creator: me.name,
      publisher: settings.site_title,
      abstract: description,
      openGraph: {
        url: settings.site_url,
        title: settings.site_title!,
        description,
        authors: [me.name!],
        firstName: me.name,
        siteName: settings.site_title!,
        images: [
          {
            url: settings.banner?.src!,
            width: 800,
            height: 600,
            alt: settings.site_title!,
          },
        ],
      },
    };
  } catch (e) {
    return {};
  }
}

export default async function Tags() {
  const data = await getTagsData();
  if (!data?.tags || !data?.settings || !data?.me) {
    return <Custom404 />;
  }
  const { tags, settings, me } = data;

  if (
    me?.__typename !== 'Author' ||
    tags.__typename !== 'TagsNode' ||
    settings.__typename !== 'Setting'
  )
    return null;
  return (
    <>
      <div className="flex flex-col items-start justify-start divide-y divide-gray-200 dark:divide-gray-700 md:mt-24 md:flex-row md:items-center md:justify-center md:space-x-6 md:divide-y-0">
        <div className="space-x-2 pb-8 pt-6 md:space-y-5">
          <PageTitle>Tags</PageTitle>
        </div>
        <SectionContainer>
          <div className="flex max-w-lg flex-wrap">
            {Object.keys(tags).length === 0 && 'No tags found.'}
            {tags.rows.map((t) => {
              const count =
                t.posts?.__typename === 'PostsNode' ? t.posts.count : 0;
              return (
                <div key={t.name} className="mb-2 mr-5 mt-2">
                  <Link
                    href={`/tag/${kebabCase(t.name)}`}
                    className="link mr-3 text-sm font-medium uppercase opacity-60 hover:text-userbrand"
                  >
                    {t.name.split(' ').join('-')}
                  </Link>
                  <Link
                    href={`/tag/${kebabCase(t.name)}`}
                    className="-ml-2 text-sm font-semibold uppercase text-gray-600 hover:text-userbrand dark:text-gray-300"
                  >
                    {`(${count})`}
                  </Link>
                </div>
              );
            })}
          </div>
        </SectionContainer>
      </div>
    </>
  );
}
