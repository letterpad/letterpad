import { FC } from 'react';

import { HomePostsProps } from '../../types/pageTypes';

export const HomePosts: FC<HomePostsProps> = ({ posts, settings }) => {
  return (
    <div>The user wants to display a collection of posts as the home page.</div>
  );
};
