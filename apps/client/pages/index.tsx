import {
  Letterpad,
  NavigationType,
  PageFragmentFragment,
  PostsFragmentFragment,
} from 'letterpad-sdk';
import { InferGetServerSidePropsType } from 'next';
import Head from 'next/head';

import SectionContainer from '@/components/SectionContainer';
import { BaseSEO, withPageSEO } from '@/components/SEO';

import Creative from '@/layouts/Creative';

import { useTheme } from '../themes';

export default function Home({
  settings,
  me,
  isPage,
  page,
  posts,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
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
        <SectionContainer>
          {isEmpty && (
            <span className="py-16 text-gray-400">
              Hi, my name is {me.name}!
            </span>
          )}
        </SectionContainer>
        {isPosts && <HomePosts posts={posts} />}
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

export async function getServerSideProps(context: any) {
  const letterpad = new Letterpad({
    letterpadServer: {
      url: process.env.API_URL!,
      token: process.env.CLIENT_ID!,
      host: context.req.headers.host,
    },
  });

  const settings = await letterpad.getSettings();

  const { menu } = settings;

  const firstItemOfMenu = menu[0];
  const isHomePageACollectionOfPosts =
    firstItemOfMenu.type === NavigationType.Tag;
  const isHomePageASinglePage = firstItemOfMenu.type === NavigationType.Page;

  const me = await letterpad.getAuthor();

  const result = {
    props: {
      me,
      settings,
      isPage: isHomePageASinglePage,
      isPosts: isHomePageACollectionOfPosts,
      posts: null as unknown as PostsFragmentFragment,
      page: null as unknown as PageFragmentFragment,
    },
  };

  if (isHomePageACollectionOfPosts) {
    const posts = await letterpad.listPosts(firstItemOfMenu.slug);
    result.props = {
      ...result.props,
      posts,
    };
  }

  if (isHomePageASinglePage) {
    const page = await letterpad.getPost(firstItemOfMenu.slug);
    result.props = {
      ...result.props,
      page,
    };
  }
  return {
    props: result.props,
  };
}
