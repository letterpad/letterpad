import { PostsFragmentFragment } from 'letterpad-sdk';
import { FC } from 'react';

export interface Props {
  posts: PostsFragmentFragment;
}

export const HomePosts: FC<Props> = ({ posts }) => {
  return (
    <div>The user wants to display a collection of posts as the home page.</div>
  );
};
