/* eslint-disable no-console */
import {
  Letterpad,
  NavigationType,
  PageFragmentFragment,
  PostsFragmentFragment,
  Setting,
  SettingResponse,
} from 'letterpad-sdk';
import { headers } from 'next/headers';
import { cache } from 'react';

function getLetterpad() {
  const headersList = headers();
  const host = headersList.get('x-forwarded-host')! ?? headersList.get('host');
  return new Letterpad({
    letterpadServer: {
      url: process.env.API_URL!,
      token: process.env.CLIENT_ID!,
      host: host.replace('www.', ''),
    },
  });
}

export const getData = cache(async () => {
  try {
    const letterpad = getLetterpad();

    const { me, settings } = await getAuthorAndSettingsData();

    const { menu } = settings;

    const firstItemOfMenu = menu[0];
    const isHomePageACollectionOfPosts =
      !firstItemOfMenu || firstItemOfMenu?.type === NavigationType.Tag;
    const isHomePageASinglePage = firstItemOfMenu?.type === NavigationType.Page;

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
      const posts = await letterpad.listPosts(firstItemOfMenu?.slug);
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
    return result.props;
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log(e);
    return undefined;
  }
});

export const getPostData = cache(async (slug: string) => {
  try {
    console.time('getPostData');
    const letterpad = getLetterpad();
    // const [post, { settings, me }] = await Promise.all([
    //   letterpad.getPost(slug),
    //   getAuthorAndSettingsData(),
    // ]);
    // console.timeEnd('getPostData');
    // return {
    //   post,
    //   settings,
    //   me,
    // };
    const r = await letterpad.getPost(slug);
    console.timeEnd('getPostData');
    return r;
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log(e);
    return undefined;
  }
});

export const getTagsData = cache(async () => {
  console.time('getTagsData');
  const letterpad = getLetterpad();

  const [tags, { settings, me }] = await Promise.all([
    letterpad.listTags(),
    getAuthorAndSettingsData(),
  ]);
  console.timeEnd('getTagsData');
  return {
    tags,
    settings,
    me,
  };
});

export const getPostsByTag = cache(async (tag: string) => {
  console.time('getPostsByTag');
  const letterpad = getLetterpad();
  const [posts, { settings, me }] = await Promise.all([
    letterpad.listPosts(tag),
    getAuthorAndSettingsData(),
  ]);
  console.timeEnd('getPostsByTag');
  return {
    posts,
    settings,
    me,
    tagName: tag,
  };
});

export const getAbout = cache(async () => {
  console.time('getAbout');
  const { settings, me } = await getAuthorAndSettingsData();
  console.timeEnd('getAbout');
  return {
    settings,
    me,
  };
});

export const getSiteMap = cache(async () => {
  const letterpad = getLetterpad();

  const sitemapResponse = await letterpad.getSitemap();
  return sitemapResponse;
});

export const getFeed = cache(async () => {
  const letterpad = getLetterpad();
  const [feedResponse, { settings, me }] = await Promise.all([
    letterpad.getFeed(),
    getAuthorAndSettingsData(),
  ]);

  return {
    feedResponse,
    me,
    settings,
  };
});

export const getPreviewData = cache(async (hash: string) => {
  const letterpad = getLetterpad();
  const post = await letterpad.getPost({
    previewHash: hash,
  });
  const { settings, me } = await getAuthorAndSettingsData();

  return {
    post,
    settings,
    me,
  };
});

export const getSettingsData = cache(async () => {
  console.time('getSettingsData');
  const { settings } = await getAuthorAndSettingsData();
  console.timeEnd('getSettingsData');
  return settings;
});

export const getAuthorData = cache(async () => {
  console.time('getAuthorData');
  const { me } = await getAuthorAndSettingsData();
  console.timeEnd('getAuthorData');
  return me;
});

export const getAuthorAndSettingsData = cache(async () => {
  console.time('getAuthorAndSettingsData');
  const letterpad = getLetterpad();
  const data = await letterpad.getMeAndSetting();
  console.timeEnd('getAuthorAndSettingsData');
  return data;
});
