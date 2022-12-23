import gql from 'graphql-tag';
import { InferGetServerSidePropsType } from 'next';
import Head from 'next/head';
import { meFragment, pageQuery, postsQuery, settingsFragment } from 'queries/queries';

import { fetchProps, PageProps } from '@/lib/client';
import {
  HomeQueryQuery,
  HomeQueryQueryVariables,
  NavigationType,
  PageQueryQuery,
  PageQueryQueryVariables,
  PostsQueryQuery,
  PostsQueryQueryVariables,
} from '@/lib/graphql';

import PageTitle from '@/components/PageTitle';
import PostGrid from '@/components/PostGrid';
import PostList from '@/components/PostList';
import SectionContainer from '@/components/SectionContainer';
import { PageSEO } from '@/components/SEO';

import Creative from '@/layouts/Creative';
import PostSimple from '@/layouts/PostSimple';

// const MAX_DISPLAY = 5;

const homeQuery = gql`
  query HomeQuery {
    ...settings
    ...me
  }

  ${settingsFragment}
  ${meFragment}
`;

export default function Home({
  settings,
  me,
  isPage,
  page,
  posts,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const { theme = 'minimal' } = settings;
  const Component = theme === 'minimal' ? PostList : PostGrid;

  return (
    <>
      <Head>
        {settings.site_favicon.src && (
          <link rel="icon" type="image/png" sizes="32x32" href={settings.site_favicon.src} />
        )}
      </Head>
      <PageSEO
        title={settings.site_title}
        description={settings.site_description}
        site_banner={settings.banner.src}
        site_title={settings.site_title}
        url={settings.site_url}
        twSite={me.social.twitter}
      />
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        {settings.banner.src ? (
          <div
            className="space-y-2 py-40 md:space-y-3"
            style={{ background: `url(${settings.banner.src})` }}
          >
            <SectionContainer>
              <div className="py-10">
                <PageTitle>{me.name}</PageTitle>
                <p className="text-center text-lg leading-7">{settings.site_description}</p>
              </div>
            </SectionContainer>
          </div>
        ) : (
          <div className="mx-auto max-w-3xl space-y-2 py-20 md:space-y-2">
            <PageTitle>{me.name}</PageTitle>
            <p className="text-center text-md leading-7 text-gray-500 dark:text-gray-400">
              {settings.site_description}
            </p>
          </div>
        )}
        <SectionContainer>
          {posts?.__typename === 'Exception' ? 'No posts found.' : ''}
          {posts?.__typename === 'PostsNode' && posts.rows.length === 0 && (
            <span className="py-16 text-gray-400">Hi, my name is {me.name}!</span>
          )}

          {!isPage && posts.__typename === 'PostsNode' && <Component posts={posts} />}
          {isPage && page.__typename === 'Post' && page.page_type === 'default' && (
            <PostSimple data={page} site_name={settings.site_title} settings={settings} me={me}>
              <div dangerouslySetInnerHTML={{ __html: page.html }}></div>
            </PostSimple>
          )}
        </SectionContainer>
        {isPage && page.__typename === 'Post' && page.page_type !== 'default' && (
          <Creative data={page} site_name={settings.site_title} settings={settings} me={me} />
        )}
      </div>
    </>
  );
}

export async function getServerSideProps(context: any) {
  const data = await fetchProps<HomeQueryQuery, HomeQueryQueryVariables>(
    homeQuery,
    {},
    context.req.headers.host
  );
  if (data.props.data.settings.__typename === 'NotFound') {
    return {
      redirect: {
        permanent: false,
        destination: '/not-found',
        status: 404,
      },
    };
  }

  if (data.props.data.settings.__typename === 'UnAuthorized') {
    return {
      redirect: {
        permanent: false,
        destination: '/not-found',
        status: 404,
      },
    };
  }

  if (data.props.data.me?.__typename !== 'Author') {
    return {
      redirect: {
        permanent: false,
        destination: '/not-found',
        status: 404,
      },
    };
  }
  //@ts-ignore
  const { menu } = data.props.data.settings;

  if (menu?.length === 0) {
    return {
      redirect: {
        permanent: false,
        destination: '/not-found',
        status: 404,
      },
    };
  }
  const firstItemOfMenu = menu[0];
  const isHomePageACollectionOfPosts = firstItemOfMenu.type === NavigationType.Tag;
  const isHomePageASinglePage = firstItemOfMenu.type === NavigationType.Page;

  const result = {
    props: {
      me: data.props.data.me,
      settings: data.props.data.settings,
      isPage: isHomePageASinglePage,
      isPosts: isHomePageACollectionOfPosts,
      posts: null as PageProps<PostsQueryQuery>['data']['posts'] | null,
      page: null as PageProps<PageQueryQuery>['data']['post'] | null,
    },
  };

  if (isHomePageACollectionOfPosts) {
    const posts = await fetchProps<PostsQueryQuery, PostsQueryQueryVariables>(
      postsQuery,
      { tagSlug: firstItemOfMenu.slug },
      context.req.headers.host
    );

    result.props = {
      ...result.props,
      posts: posts.props.data.posts,
    };
  }

  if (isHomePageASinglePage) {
    const page = await fetchProps<PageQueryQuery, PageQueryQueryVariables>(
      pageQuery,
      { slug: firstItemOfMenu.slug },
      context.req.headers.host
    );
    result.props = {
      ...result.props,
      page: page.props.data.post,
    };
  }
  return {
    props: result.props,
  };
}
