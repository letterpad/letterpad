// export const runtime = 'edge';

import { Image } from 'ui/dist/isomorphic.mjs';

import { getData } from '@/data';

import Custom404 from './not-found';
import { Navbar } from '../components/navbar';
import { StructuredData } from '../components/structured-data';
import { getProfileUrl } from '../../lib/utils/url';
import { SectionContainer } from '../../src/components/section';
import { getTheme } from '../../themes';

export default async function Home() {
  const data = await getData();
  if (!data) {
    return <Custom404 />;
  }
  const { settings, me, posts } = data;
  const { HomePosts, PreHeader } = getTheme(settings?.theme);

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
      <Navbar settings={settings} isHome={true} me={me} PreHeader={PreHeader} />
      <StructuredData data={jsonLd} />
      <div>
        <SectionContainer>
          {isEmpty && (
            <span className="py-16 text-gray-400">
              Hi, my name is {me.name}!
            </span>
          )}
        </SectionContainer>
        <HomePosts posts={posts} settings={settings} />
        <AboutMe me={me} />
      </div>
    </>
  );
}

const AboutMe = ({ me }) => {
  return (
    <div className="rounded text-center text-gray-500 dark:text-gray-200 p-8 md:px-0 dark:bg-slate-800 bg-slate-100 shadow-inner">
      <Image
        className="w-20 h-20 rounded-full mx-auto border-[1px] object-cover"
        src={me.avatar
          .replace('image/upload', 'image/upload/c_scale,w_200')
          .replace('w=1080', 'w=200')}
        alt={me.name}
      />
      <div className="mt-5">
        <a
          href={getProfileUrl(me.username)}
          className="text-2xl font-bold leading-none text-gray-900 dark:text-gray-300 transition duration-500 ease-in-out"
        >
          {me.name}
        </a>
        <p>{me.occupation}</p>
      </div>

      <p className="mt-2 text-sm">{me.signature}</p>
    </div>
  );
};
