import {
  Letterpad,
  NavigationType,
  PageFragmentFragment,
  PostsFragmentFragment,
} from 'letterpad-sdk';
import { InferGetServerSidePropsType } from 'next';
import Head from 'next/head';

import PageTitle from '@/components/PageTitle';
// import PostList from '@/components/PostList';
import SectionContainer from '@/components/SectionContainer';
import { PageSEO } from '@/components/SEO';

import Creative from '@/layouts/Creative';
import GridLayout from '@/layouts/GridLayout';
import ListLayout from '@/layouts/ListLayout';
import PageHomeLayout from '@/layouts/PageHomeLayout';

// const MAX_DISPLAY = 5;

export default function Home({
  settings,
  me,
  isPage,
  page,
  posts,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const { theme = 'minimal' } = settings;
  const Component = theme === 'minimal' ? ListLayout : GridLayout;

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
      <PageSEO
        title={settings.site_title}
        description={settings.site_description ?? ''}
        site_banner={settings.banner?.src}
        site_title={settings.site_title}
        url={settings.site_url}
        twSite={me.social?.twitter}
      />
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        {settings.banner?.src ? (
          <div
            className="space-y-2 py-40 md:space-y-3"
            style={{ background: `url(${settings.banner.src})` }}
          >
            <SectionContainer>
              <div className="py-10">
                <PageTitle>{me.name}</PageTitle>
                <p className="text-center text-lg leading-7">
                  {settings.site_description}
                </p>
              </div>
            </SectionContainer>
          </div>
        ) : (
          <div className="mx-auto max-w-3xl space-y-2 py-20 md:space-y-2">
            <PageTitle>{me.name}</PageTitle>
            <p className="px-4 text-center text-md leading-7 text-gray-500 dark:text-gray-300">
              {settings.site_description}
            </p>
          </div>
        )}
        <SectionContainer>
          {posts?.__typename === 'PostsNode' && posts.rows.length === 0 && (
            <span className="py-16 text-gray-400">
              Hi, my name is {me.name}!
            </span>
          )}
        </SectionContainer>
        {!isPage && posts?.__typename === 'PostsNode' && (
          <Component posts={posts} />
        )}
        {isPage && page?.__typename === 'Post' && page.page_type === 'default' && (
          <PageHomeLayout
            data={page}
            site_name={settings.site_title}
            settings={settings}
            me={me}
          >
            <div dangerouslySetInnerHTML={{ __html: page.html ?? '' }}></div>
          </PageHomeLayout>
        )}

        {isPage &&
          page?.__typename === 'Post' &&
          page.page_type !== 'default' && (
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

  // if (menu?.length === 0) {
  //   return {
  //     redirect: {
  //       permanent: false,
  //       destination: '/not-found',
  //       status: 404,
  //     },
  //   };
  // }
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
