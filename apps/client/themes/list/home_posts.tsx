import { FC } from 'react';

import { RenderCard } from './renderCard';
import { SectionContainer } from '../../src/components/section';
import { HomePostsProps } from '../../types/pageTypes';

export const HomePosts: FC<HomePostsProps> = ({ posts, loadMore }) => {
  return (
    <SectionContainer className="px-4">
      <div className="w-full divide-y divide-gray-200 py-12 dark:divide-gray-700">
        <ul>
          {posts?.rows.map((post) => (
            <RenderCard key={post.slug} post={post} />
          ))}

          {loadMore(RenderCard)}
        </ul>
      </div>
    </SectionContainer>
  );
};
