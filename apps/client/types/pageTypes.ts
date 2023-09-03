import {
  MeFragmentFragment,
  PageFragmentFragment,
  PostsFragmentFragment,
  SettingsFragmentFragment,
} from 'letterpad-sdk';
import { ReactNode } from 'react';

import {
  getAbout,
  getData,
  getPostData,
  getPostsByTag,
  getPreviewData,
  getTagsData,
} from '../src/data';

export interface LayoutProps {
  children: ReactNode;
  props: Pick<Awaited<ReturnType<typeof getData>>, 'me' | 'settings'>;
}

export interface HomePostsProps {
  posts: PostsFragmentFragment;
  settings: SettingsFragmentFragment;
}

export interface HomePageProps {
  data: PageFragmentFragment;
  children: ReactNode;
  settings: SettingsFragmentFragment;
  me: MeFragmentFragment;
}

export interface PostProps {
  post: Pick<Awaited<ReturnType<typeof getPostData>>, 'post'>['post'];
  settings: SettingsFragmentFragment;
  me: MeFragmentFragment;
}

export type TagProps = Awaited<ReturnType<typeof getPostsByTag>>;

export interface TagsProps {
  tags: Awaited<ReturnType<typeof getTagsData>>['tags'];
  me: Awaited<ReturnType<typeof getTagsData>>['me'];
  settings: Awaited<ReturnType<typeof getTagsData>>['settings'];
}

export type PreviewProps = Awaited<ReturnType<typeof getPreviewData>>;
export type AboutProps = Awaited<ReturnType<typeof getAbout>>;
