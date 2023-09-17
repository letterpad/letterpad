import {
  Letterpad,
  NavigationType,
  PageFragmentFragment,
  PostsFragmentFragment,
} from 'letterpad-sdk';
import { headers } from 'next/headers';
import { cache } from 'react';

function getLetterpad() {
  const headersList = headers();
  const host = headersList.get('host')!;
  return new Letterpad({
    letterpadServer: {
      url: process.env.API_URL!,
      token: process.env.CLIENT_ID!,
      host,
    },
  });
}

export const getData = cache(async () => {
  try {
    const letterpad = getLetterpad();

    const settings = await letterpad.getSettings();

    const { menu } = settings;

    const firstItemOfMenu = menu[0];
    const isHomePageACollectionOfPosts =
      !firstItemOfMenu || firstItemOfMenu?.type === NavigationType.Tag;
    const isHomePageASinglePage = firstItemOfMenu?.type === NavigationType.Page;

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
    const letterpad = getLetterpad();
    const [post, settings, me] = await Promise.all([
      letterpad.getPost(slug),
      letterpad.getSettings(),
      letterpad.getAuthor(),
    ]);
    return {
      post,
      settings,
      me,
    };
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log(e);
    return undefined;
  }
});

export const getTagsData = cache(async () => {
  const letterpad = getLetterpad();

  const [tags, settings, me] = await Promise.all([
    letterpad.listTags(),
    letterpad.getSettings(),
    letterpad.getAuthor(),
  ]);

  return {
    tags,
    settings,
    me,
  };
});

export const getPostsByTag = cache(async (tag: string) => {
  const letterpad = getLetterpad();
  const [posts, settings, me] = await Promise.all([
    letterpad.listPosts(tag),
    letterpad.getSettings(),
    letterpad.getAuthor(),
  ]);

  return {
    posts,
    settings,
    me,
    tagName: tag,
  };
});

export const getAbout = cache(async () => {
  const letterpad = getLetterpad();
  const settings = await letterpad.getSettings();
  const me = await letterpad.getAuthor();

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
  const [feedResponse, settings, me] = await Promise.all([
    letterpad.getFeed(),
    letterpad.getSettings(),
    letterpad.getAuthor(),
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
  const settings = await letterpad.getSettings();
  const me = await letterpad.getAuthor();

  return {
    post,
    settings,
    me,
  };
});
