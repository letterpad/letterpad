import {
  MeFragmentFragment,
  PageFragmentFragment,
  PostsFragmentFragment,
  SettingsFragmentFragment,
} from 'letterpad-sdk';
import { ReactNode } from 'react';

import {
  getAbout,
  getPostsByTag,
  getPreviewData,
  getTagsData,
} from '../src/data';

export interface LayoutProps {
  children: ReactNode;
}

export interface HomePostsProps {
  posts: PostsFragmentFragment;
  settings?: SettingsFragmentFragment;
  className?: string;
}

export interface HomePageProps {
  data: PageFragmentFragment;
  children: ReactNode;
  settings: SettingsFragmentFragment;
  me: MeFragmentFragment;
}

export interface PostProps {
  post: PageFragmentFragment;
  settings: SettingsFragmentFragment;
  me: MeFragmentFragment;
}

export type TagProps = NonNullable<Awaited<ReturnType<typeof getPostsByTag>>>;

export type TagsProps = NonNullable<Awaited<ReturnType<typeof getTagsData>>>;
export type PreviewProps = NonNullable<
  Awaited<ReturnType<typeof getPreviewData>>
>;
export type AboutProps = NonNullable<Awaited<ReturnType<typeof getAbout>>>;
