/* eslint-disable no-console */
import {
  Letterpad,
  MeFragmentFragment,
  NavigationType,
  PageFragmentFragment,
  PostsFragmentFragment,
  SettingsFragmentFragment,
} from 'letterpad-sdk';
import { headers } from 'next/headers';

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

export const getData = async () => {
  try {
    const letterpad = getLetterpad();

    const data = await getAuthorAndSettingsData();
    const settings = data?.settings;
    const me = data?.me;
    if (!settings || !me) {
      return null;
    }
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
};

export const getPostData = async (slug: string) => {
  try {
    const letterpad = getLetterpad();
    const r = await letterpad.getPost(slug);

    return r;
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log(e);
    return undefined;
  }
};

export const getTagsData = async () => {
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
};

export const getPostsByTag = async (tag: string) => {
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
};

export const getAbout = async () => {
  try {
    const data = await getAuthorAndSettingsData();
    return data;
  } catch (e) {
    return null;
  }
};

export const getSiteMap = async () => {
  try {
    const letterpad = getLetterpad();

    const sitemapResponse = await letterpad.getSitemap();
    return sitemapResponse;
  } catch (e) {}
};

export const getFeed = async () => {
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
};

export const getPreviewData = async (hash: string) => {
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
};

export const getSettingsData = async () => {
  try {
    const data = await getAuthorAndSettingsData();
    return data?.settings as SettingsFragmentFragment;
  } catch (e) {
    return null;
  }
};

export const getAuthorData = async () => {
  try {
    const data = await getAuthorAndSettingsData();
    return data?.me as MeFragmentFragment;
  } catch (e) {
    return null;
  }
};

export const getAuthorAndSettingsData = async () => {
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
};
