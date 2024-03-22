/* eslint-disable no-console */
import {
  Letterpad,
  MeFragmentFragment,
  PageFragmentFragment,
  PostsFragmentFragment,
  SettingsFragmentFragment,
} from 'letterpad-sdk';
import { headers } from 'next/headers';
import { cache } from 'react';

import { getApiUrl } from '../lib/utils/url';

function getApiUrlWithVercel() {
  if (process.env.VERCEL_ENV === 'preview') {
    return process.env.VERCEL_BRANCH_URL?.replace('client', 'admin');
  }
  console.log('===================', getApiUrl());
  return getApiUrl()!;
}
function getLetterpad() {
  const headersList = headers();
  const host = headersList.get('x-forwarded-host')! ?? headersList.get('host');
  return new Letterpad({
    letterpadServer: {
      url: getApiUrlWithVercel() ?? '',
      token: process.env.CLIENT_ID!,
      host: host.replace('www.', ''),
    },
  });
}

export const getData = cache(async () => {
  try {
    const letterpad = getLetterpad();

    const data = await getAuthorAndSettingsData();
    const settings = data?.settings;
    const me = data?.me;
    if (!settings || !me) {
      return null;
    }
    const result = {
      props: {
        me,
        settings,
        posts: null as unknown as PostsFragmentFragment,
        page: null as unknown as PageFragmentFragment,
      },
    };
    const posts = await letterpad.listPosts('/');
    result.props = {
      ...result.props,
      posts,
    };
    return result.props;
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log(e);
    return undefined;
  }
});

export const getPostData = cache(async (slug: string) => {
  try {
    const letterpad = getLetterpad();
    const r = await letterpad.getPost(slug);

    return r;
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log(e);
    return undefined;
  }
});

export const getTagsData = cache(async () => {
  try {
    const letterpad = getLetterpad();
    const [tags, data] = await Promise.all([
      letterpad.listTags(),
      getAuthorAndSettingsData(),
    ]);

    return {
      tags,
      settings: data?.settings,
      me: data?.me,
    };
  } catch (e) {}
});

export const getPostsByTag = cache(async (tag: string) => {
  try {
    const letterpad = getLetterpad();
    const [posts, data] = await Promise.all([
      letterpad.listPosts(tag),
      getAuthorAndSettingsData(),
    ]);

    return {
      posts,
      settings: data?.settings as SettingsFragmentFragment,
      me: data?.me as MeFragmentFragment,
      tagName: tag,
    };
  } catch (e) {}
});

export const getAbout = cache(async () => {
  try {
    const data = await getAuthorAndSettingsData();
    return data;
  } catch (e) {
    return null;
  }
});

export const getSiteMap = cache(async () => {
  try {
    const letterpad = getLetterpad();

    const sitemapResponse = await letterpad.getSitemap();
    return sitemapResponse;
  } catch (e) {}
});

export const getFeed = cache(async () => {
  try {
    const letterpad = getLetterpad();
    const [feedResponse, data] = await Promise.all([
      letterpad.getFeed(),
      getAuthorAndSettingsData(),
    ]);

    return {
      feedResponse,
      me: data?.me,
      settings: data?.settings,
    };
  } catch (e) {}
});

export const getPreviewData = cache(async (hash: string) => {
  try {
    const letterpad = getLetterpad();
    const post = await letterpad.getPost({
      previewHash: hash,
    });
    const data = await getAuthorAndSettingsData();
    return {
      post,
      settings: data?.settings as SettingsFragmentFragment,
      me: data?.me as MeFragmentFragment,
    };
  } catch (e) {
    return null;
  }
});

export const getSettingsData = cache(async () => {
  try {
    const data = await getAuthorAndSettingsData();
    return data?.settings as SettingsFragmentFragment;
  } catch (e) {
    return null;
  }
});

export const getAuthorData = cache(async () => {
  try {
    const data = await getAuthorAndSettingsData();
    return data?.me as MeFragmentFragment;
  } catch (e) {
    return null;
  }
});

export const getAuthorAndSettingsData = cache(async () => {
  try {
    const letterpad = getLetterpad();
    const data = await letterpad.getMeAndSetting();
    return data as {
      me: MeFragmentFragment;
      settings: SettingsFragmentFragment;
    };
  } catch (e) {
    return null;
  }
});
