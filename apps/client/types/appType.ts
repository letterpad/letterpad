import { InferGetServerSidePropsType } from 'next';

import { getServerSideProps as home } from '../pages';
import { getServerSideProps as about } from '../pages/about';
import { getServerSideProps as page } from '../pages/page/[...slug]';
import { getServerSideProps as post } from '../pages/post/[...slug]';
import { getServerSideProps as preview } from '../pages/preview/[hash]';
import { getServerSideProps as tag } from '../pages/tag/[tag]';
import { getServerSideProps as tags } from '../pages/tags';

type TagsPage = InferGetServerSidePropsType<typeof tags> & { type: 'tags' };
type HomePage = InferGetServerSidePropsType<typeof home> & { type: 'home' };
type PagePage = InferGetServerSidePropsType<typeof page> & { type: 'page' };
type PostPage = InferGetServerSidePropsType<typeof post> & { type: 'post' };
type TagPage = InferGetServerSidePropsType<typeof tag> & { type: 'tag' };
type AboutPage = InferGetServerSidePropsType<typeof about> & { type: 'about' };
type PreviewPage = InferGetServerSidePropsType<typeof preview> & {
  type: 'preview';
};

export type PageProps =
  | TagsPage
  | PostPage
  | TagPage
  | HomePage
  | PagePage
  | PreviewPage;
