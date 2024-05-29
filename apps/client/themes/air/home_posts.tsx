import classNames from 'classnames';
import { PostsFragmentFragment } from 'letterpad-sdk';
import { FC } from 'react';
import { HomePostsProps } from 'types/pageTypes';
import { Image } from 'ui/dist/isomorphic.mjs';

import formatDate from '@/lib/utils/formatDate';

import Link from '@/components/Link';

import { SectionContainer } from '../../src/components/section';

export const HomePosts: FC<HomePostsProps> = ({ posts }) => {
  let featuredThreePosts;
  let featuredPostsCount = 0;
  if (posts.rows[0]) {
    featuredPostsCount = 1;
    featuredThreePosts = (
      <>
        <Card post={posts.rows[0]} size="md" />
      </>
    );
  }
  if (posts.rows[1]) {
    featuredPostsCount = 2;
    featuredThreePosts = (
      <>
        <Card post={posts.rows[0]} size="md" />
        <div className="flex flex-col gap-10 md:flex-row xl:flex-col ">
          <div className="flex-1">
            <Card post={posts.rows[1]} />
          </div>
        </div>
      </>
    );
  }
  if (posts.rows[2]) {
    featuredPostsCount = 3;
    featuredThreePosts = (
      <>
        <Card post={posts.rows[0]} size="md" />
        <div className="flex flex-col gap-10 md:flex-row xl:flex-col ">
          <div className="flex-1">
            <Card post={posts.rows[1]} />
          </div>
          <div className="flex-1">
            <Card post={posts.rows[2]} />
          </div>
        </div>
      </>
    );
  }
  // const arr = chunk(posts.rows, featuredThreePosts);
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
              index >= featuredPostsCount ? <Card post={post} /> : null
            )}
          </div>
        </>
      ) : null}
    </SectionContainer>
  );
};

const Card: FC<{
  post: PostsFragmentFragment['rows'][0];
  size?: 'sm' | 'md';
}> = ({ post, size = 'sm' }) => {
  return (
    <div className="shrink-0 basis-full xl:basis-[70%]">
      <Link className="block" href={post.slug!}>
        <div className="relative block bg-black/5 pt-[75%] dark:bg-white/5 ">
          <Image
            src={post.cover_image.src ?? ''}
            className="object-cover"
            alt={post.title}
          />
        </div>
      </Link>
      <div className="mt-8 flex flex-wrap items-center gap-3">
        <div className="data-color flex items-center text-sm ">
          <span className="whitespace-nowrap ">
            {formatDate(post.publishedAt)}
          </span>
          <span className="px-2.5">⋅</span>
          <span className="whitespace-nowrap">
            {post.stats?.reading_time} read
          </span>
        </div>
      </div>
      <h4
        className={classNames('mt-4 text-xl font-bold leading-snug', {
          'sm:text-2xl': size === 'sm',
          'sm:text-4xl': size === 'md',
        })}
      >
        <Link className="block" href={post.slug!}>
          {post.title}
        </Link>
      </h4>
      <p
        className={classNames('mt-4 font-normal opacity-80', {
          'sm:text-md': size === 'sm',
          'sm:text-xl': size === 'md',
        })}
      >
        {post.excerpt}
      </p>
      <div className="mt-6 flex items-center gap-2">
        <div>
          <Link className="heading-color text-sm font-medium" href="/about">
            {post.author?.__typename === 'Author' ? post.author.name : ''}
          </Link>
        </div>
      </div>
    </div>
  );
};
