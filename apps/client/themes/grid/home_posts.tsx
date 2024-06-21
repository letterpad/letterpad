import classNames from 'classnames';
import { FC } from 'react';

import { RenderCard } from './renderCard';
import { SectionContainer } from '../../src/components/section';
import { HomePostsProps } from '../../types/pageTypes';

export const HomePosts: FC<HomePostsProps> = ({
  posts,
  className,
  loadMore,
}) => {
  return (
    <>
      <SectionContainer
        className={classNames('mx-auto max-w-6xl md:px-5', className)}
      >
        <div className="grid grid-cols-1 gap-8 py-12 md:grid-cols-2 xl:grid-cols-3">
          {posts?.rows.map((post) => (
            <RenderCard key={post.slug} post={post} />
          ))}

          {loadMore(RenderCard)}
        </div>
      </SectionContainer>
    </>
  );
};
