import { FC } from 'react';

import { List } from './commons/list';
import { HomePostsProps } from '../../types/pageTypes';

export const HomePosts: FC<HomePostsProps> = ({ posts }) => {
  return <List posts={posts} />;
};
