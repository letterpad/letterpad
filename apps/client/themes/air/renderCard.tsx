'use client';
import classNames from 'classnames';
import { PostsFragmentFragment } from 'letterpad-sdk';
import { FC } from 'react';
import { Image } from 'ui/dist/isomorphic.mjs';

import formatDate from '@/lib/utils/formatDate';

import Link from '@/components/Link';

export const RenderCard: FC<{
  post: PostsFragmentFragment['rows'][0];
  size?: 'sm' | 'md';
}> = ({ post, size = 'sm' }) => {
  return (
    <div className="shrink-0 basis-full xl:basis-[70%] space-y-4">
      <Link className="block" href={post.slug!}>
        <div className="relative block bg-black/5 dark:bg-white/5 ">
          <Image
            src={post.cover_image.src ?? ''}
            className="object-cover"
            alt={post.title}
          />
        </div>
      </Link>
      <div className="flex flex-wrap items-center gap-3">
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
        className={classNames('text-xl font-bold leading-snug', {
          'sm:text-md': size === 'sm',
          'sm:text-4xl': size === 'md',
        })}
      >
        <Link className="block" href={post.slug!}>
          {post.title}
        </Link>
      </h4>
      <p
        className={classNames('font-normal opacity-80', {
          'sm:text-md': size === 'sm',
          'sm:text-xl': size === 'md',
        })}
      >
        {post.excerpt}
      </p>
      <div className="flex items-center gap-2">
        <div>
          <Link className="heading-color text-sm font-medium" href="/about">
            {post.author?.__typename === 'Author' ? post.author.name : ''}
          </Link>
        </div>
      </div>
    </div>
  );
};
