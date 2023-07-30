import {
  Letterpad,
  NavigationType,
  PageFragmentFragment,
  PostsFragmentFragment,
} from 'letterpad-sdk';
import { headers } from 'next/headers';

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

export async function getData() {
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
}

export async function getPostData(slug: string) {
  const letterpad = getLetterpad();

  const post = await letterpad.getPost(slug);
  const settings = await letterpad.getSettings();
  const me = await letterpad.getAuthor();

  return {
    post,
    settings,
    me,
  };
}

export async function getTagsData() {
  const letterpad = getLetterpad();
  const tags = await letterpad.listTags();
  const settings = await letterpad.getSettings();
  const me = await letterpad.getAuthor();

  return {
    tags,
    settings,
    me,
  };
}

export async function getPostsByTag(tag: string) {
  const letterpad = getLetterpad();
  const posts = await letterpad.listPosts(tag);
  const settings = await letterpad.getSettings();
  const me = await letterpad.getAuthor();

  return {
    posts,
    settings,
    me,
    tagName: tag,
  };
}

export async function getAbout() {
  const letterpad = getLetterpad();
  const settings = await letterpad.getSettings();
  const me = await letterpad.getAuthor();

  return {
    settings,
    me,
  };
}

export async function getSiteMap() {
  const letterpad = getLetterpad();

  const sitemapResponse = await letterpad.getSitemap();
  return sitemapResponse;
}

export async function getFeed() {
  const letterpad = getLetterpad();

  const feedResponse = await letterpad.getFeed();
  const me = await letterpad.getAuthor();
  const settings = await letterpad.getSettings();

  return {
    feedResponse,
    me,
    settings,
  };
}

export async function getPreviewData(hash: string) {
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
}
