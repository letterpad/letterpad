import { FC } from 'react';
import { HomePostsProps } from 'types/pageTypes';

import { RenderCard } from './renderCard';
import { SectionContainer } from '../../src/components/section';

export const HomePosts: FC<HomePostsProps> = ({ posts, loadMore }) => {
  let featuredThreePosts;
  let featuredPostsCount = 0;
  if (posts.rows[0]) {
    featuredPostsCount = 1;
    featuredThreePosts = (
      <>
        <RenderCard post={posts.rows[0]} size="md" />
      </>
    );
  }
  if (posts.rows[1]) {
    featuredPostsCount = 2;
    featuredThreePosts = (
      <>
        <RenderCard post={posts.rows[0]} size="md" />
        <div className="flex flex-col gap-10 md:flex-row xl:flex-col ">
          <div className="flex-1">
            <RenderCard post={posts.rows[1]} />
          </div>
        </div>
      </>
    );
  }
  if (posts.rows[2]) {
    featuredPostsCount = 3;
    featuredThreePosts = (
      <>
        <RenderCard post={posts.rows[0]} size="md" />
        <div className="flex flex-col gap-10 md:flex-row xl:flex-col ">
          <div className="flex-1">
            <RenderCard post={posts.rows[1]} />
          </div>
          <div className="flex-1">
            <RenderCard post={posts.rows[2]} />
          </div>
        </div>
      </>
    );
  }

  const hasLatestPosts = posts.count - featuredPostsCount;

  return (
    <SectionContainer className="mx-auto max-w-7xl md:px-20">
      <h4 className="mb-4 mt-10 text-base font-medium uppercase tracking-wider">
        Featured Posts
      </h4>
      <div className="flex flex-wrap gap-10 xl:flex-nowrap ">
        {featuredThreePosts}
      </div>
      {hasLatestPosts ? (
        <>
          <h4 className="mb-4 mt-32 text-base font-medium uppercase tracking-wider">
            Latest Posts
          </h4>
          <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-3">
            {posts.rows.map((post, index) =>
              index >= featuredPostsCount ? <RenderCard post={post} /> : null
            )}
            {loadMore(RenderCard)}
          </div>
        </>
      ) : null}
    </SectionContainer>
  );
};
