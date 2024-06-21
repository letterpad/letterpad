'use client';
import { PostsFragmentFragment } from 'letterpad-sdk';
import { FC } from 'react';

import Link from '@/components/Link';

import { PublishedAt } from '../../src/components/published-at';

export const RenderCard: FC<{ post: PostsFragmentFragment['rows'][0] }> = ({
  post,
}) => {
  const { slug, publishedAt, title, excerpt, stats } = post;
  return (
    <li
      key={slug}
      className="py-12 dark:border-gray-800 [&:not(:last-child)]:border-b-[1px]"
    >
      <article className="md:space-y-2 xl:grid xl:grid-cols-4 xl:items-baseline xl:space-y-0">
        <PublishedAt
          publishedAt={publishedAt}
          className="flex justify-between text-sm xl:block"
          reading_time={stats?.reading_time!}
        />
        <div className="md:space-y-3 xl:col-span-3">
          <div>
            <h3 className="text-xl font-bold leading-8 tracking-tight md:text-2xl">
              <Link
                href={`${slug}`}
                className="text-gray-900 dark:text-gray-100"
              >
                {title}
              </Link>
            </h3>
          </div>
          <div className="max-w-none text-md leading-6 text-gray-500 dark:text-gray-300">
            {excerpt}
          </div>
        </div>
      </article>
    </li>
  );
};
