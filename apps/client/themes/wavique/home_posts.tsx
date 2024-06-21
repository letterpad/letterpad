import { FC } from 'react';
import { HomePostsProps } from 'types/pageTypes';

import { Layout } from './layout';
import { RenderCard } from './renderCard';

export const HomePosts: FC<HomePostsProps> = ({ posts, loadMore }) => {
  return (
    <Layout>
      <div className="divide-y pb-16">
        <GridLayout posts={posts.rows} loadMore={loadMore} />
      </div>
    </Layout>
  );
};

function GridLayout({ posts, loadMore }) {
  return (
    <ul className="grid grid-cols-1 gap-8 py-12 md:grid-cols-2 xl:grid-cols-3">
      {!posts.length && 'No posts found.'}
      {posts.map((post) => (
        <RenderCard key={post.slug} post={post} />
      ))}
      {loadMore(RenderCard)}
    </ul>
  );
}
