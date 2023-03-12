import classNames from 'classnames';
import { PostsFragmentFragment } from 'letterpad-sdk';
import { InferGetServerSidePropsType } from 'next';
import { FC } from 'react';

import formatDate from '@/lib/utils/formatDate';

import Image from '@/components/Image';
import Link from '@/components/Link';

export const Card: FC<{
  post: PostsFragmentFragment['rows'][0];
  size?: 'sm' | 'md' | 'xs';
}> = ({ post, size = 'sm' }) => {
  return (
    <div className="shrink-0 basis-full xl:basis-[60%]">
      <Link className="block" href={post.slug!}>
        <div className="relative block bg-black/5 pt-[75%] dark:bg-white/5 ">
          <Image
            src={post.cover_image?.src ?? ''}
            layout="fill"
            alt={post.title}
            objectFit="cover"
          />
        </div>
      </Link>
      <div>
        <div
          className={classNames('flex flex-wrap items-center gap-3', {
            'mt-8': size !== 'xs',
            'mt-2': size === 'xs',
          })}
        >
          <div className="data-color flex items-center text-sm ">
            <span className="whitespace-nowrap ">
              {formatDate(post.publishedAt)}
            </span>
            <span className="px-2.5">⋅</span>
            <span className="whitespace-nowrap">
              {post.stats?.reading_time} min read
            </span>
          </div>
        </div>
        <h2
          className={classNames(' text-xl font-bold leading-snug', {
            'sm:text-sm': size === 'xs',
            'sm:text-2xl': size === 'sm',
            'sm:text-4xl': size === 'md',

            'mt-2': size === 'xs',
            'mt-4': size !== 'xs',
          })}
        >
          <Link className="block" href={post.slug!}>
            {post.title}
          </Link>
        </h2>
        <p
          className={classNames('font-normal opacity-80', {
            'sm:text-sm': size === 'xs',
            'sm:text-md': size === 'sm',
            'sm:text-xl': size === 'md',
            'mt-2': size === 'xs',
            'mt-4': size !== 'xs',
          })}
        >
          {post.excerpt}
        </p>
        <div
          className={classNames('mt-6 flex items-center gap-2', {
            hidden: size === 'xs',
          })}
        >
          <div>
            <Link className="heading-color text-sm font-medium" href="/about">
              {post.author?.__typename === 'Author' ? post.author.name : ''}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export const HorizontalCard = ({ post }) => {
  return (
    <Link
      className="flex flex-col items-center gap-2 rounded-lg  md:max-w-xl md:flex-row"
      href={post.slug!}
    >
      <div className="relative block h-52 w-full bg-black/5 dark:bg-white/5 sm:h-44 sm:w-52">
        <Image
          src={post.cover_image?.src ?? ''}
          alt={post.title}
          objectFit="cover"
          layout="fill"
          className="rounded-t-lg  md:rounded-lg"
        />
      </div>

      <div className="flex w-full flex-col justify-between p-2 leading-normal">
        <h5 className="mb-2 text-sm font-bold tracking-tight text-gray-900 dark:text-white">
          {post.title}
        </h5>
        <p className="mb-3 text-sm font-normal leading-5 text-gray-700 dark:text-white/70">
          {post.excerpt}
        </p>

        <div className="data-color flex items-center text-xs  opacity-60">
          <span className="whitespace-nowrap ">
            {formatDate(post.publishedAt)}
          </span>
          <span className="px-2.5">⋅</span>
          <span className="whitespace-nowrap">
            {post.stats?.reading_time} min read
          </span>
        </div>
      </div>
    </Link>
  );
};
