import { PostsFragmentFragment } from 'letterpad-sdk';
import { FC } from 'react';

import { List } from './commons/list';

export interface Props {
  posts: PostsFragmentFragment;
}

export const HomePosts: FC<Props> = ({ posts }) => {
  return <List posts={posts} />;
};
