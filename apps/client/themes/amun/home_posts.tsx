import { PostsFragmentFragment } from 'letterpad-sdk';
import { FC, ReactNode } from 'react';

import { Card, HorizontalCard } from './commons/card';
import { HomePostsProps } from '../../types/pageTypes';

const pickThreePostsMax = (posts: PostsFragmentFragment['rows']) => {
  if (posts.length >= 3) return posts.slice(0, 3);
  if (posts.length >= 2) return posts.slice(0, 2);
  if (posts.length >= 1) return posts.slice(0, 1);
  return posts;
};

export const HomePosts: FC<HomePostsProps> = ({ posts, settings }) => {
  // const category = []?.filter((tag) => tag.type == TagType.Category).pop();
  // const sidePosts =
  //   category?.posts?.__typename === 'PostsNode' ? category?.posts?.rows : [];

  const firstThreeMax = pickThreePostsMax(posts.rows);
  const olderPosts = posts.rows.slice(firstThreeMax.length);
  return (
    <>
      <div className="flex flex-col gap-12 lg:flex-row">
        <LatestPosts posts={firstThreeMax} />
        <SidePosts posts={firstThreeMax} name={'some name'} />
      </div>

      <OlderPosts posts={olderPosts} />
    </>
  );
};

const LatestPosts = ({ posts }: { posts: PostsFragmentFragment['rows'] }) => {
  let latestThreePosts: ReactNode = null;
  let count = posts.length;
  if (count === 1) {
    latestThreePosts = (
      <>
        <Card post={posts[0]} size="md" />
      </>
    );
  }
  if (count === 2) {
    latestThreePosts = (
      <>
        <Card post={posts[0]} size="md" />
        <div className="flex flex-col gap-10 md:flex-row xl:flex-col ">
          <div className="flex-1">
            <Card post={posts[1]} />
          </div>
        </div>
      </>
    );
  }
  if (count === 3) {
    latestThreePosts = (
      <>
        <Card post={posts[0]} size="md" />
        <div className="flex flex-col gap-6 lg:flex-row xl:flex-col">
          <div className="flex-1">
            <Card post={posts[1]} imageHeight="sm" size="sm" />
          </div>
          <div className="flex-1">
            <Card post={posts[2]} imageHeight="sm" size="sm" />
          </div>
        </div>
      </>
    );
  }

  return (
    <div className="flex flex-col">
      <span className="font-system mb-4 mt-10 text-base font-medium uppercase tracking-wider">
        Latest Posts
      </span>
      <div className="flex flex-wrap gap-10 xl:flex-nowrap ">
        {latestThreePosts}
      </div>
    </div>
  );
};

const OlderPosts = ({ posts }: { posts: PostsFragmentFragment['rows'] }) => {
  if (posts.length === 0) return null;
  return (
    <div className="flex flex-col">
      <span className="font-system mb-4 mt-32 text-base font-medium uppercase tracking-wider">
        Previous Posts
      </span>
      <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <Card post={post} />
        ))}
      </div>
    </div>
  );
};

const SidePosts = ({
  posts,
  name,
}: {
  posts: PostsFragmentFragment['rows'];
  name: string;
}) => {
  if (posts.length === 0) return null;
  return (
    <div className="hidden flex-col dark:bg-opacity-30 lg:flex">
      <span className="font-system mb-4 mt-10 text-base font-medium uppercase tracking-wider">
        Category: {name.toUpperCase()}
      </span>
      <div className="space-y-8">
        {posts.map((tag) => (
          <HorizontalCard post={tag} key={tag.id} />
        ))}
      </div>
    </div>
  );
};
