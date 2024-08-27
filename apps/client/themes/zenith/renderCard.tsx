'use client';
import { PostsFragmentFragment } from 'letterpad-sdk';
import { FC } from 'react';
import { Image } from 'ui/dist/isomorphic.mjs';

import Link from '@/components/Link';

import { Tag } from './tag';
import { getReadableDate } from '../../src/utils';

export const RenderCard: FC<{ post: PostsFragmentFragment['rows'][0] }> = ({
  post,
}) => {
  const { slug, publishedAt, title, excerpt, stats, id, cover_image, tags } =
    post;
  const topic =
    tags?.__typename === 'TagsNode'
      ? tags.rows.find((tag) => tag.name.startsWith('_topic_'))
      : null;
  return (
    <article aria-labelledby={`episode-${id}-title`} className="py-10 sm:py-12">
      <div className="lg:px-8">
        <div className="lg:max-w-4xl">
          <div className="relative">
            <Link href={`${slug}`}>
              <Image
                src={cover_image.src!}
                alt={title}
                className="mb-8 w-full h-72 object-cover rounded-lg"
                loading="lazy"
              />
            </Link>
            {topic?.name && (
              <Tag
                text={topic.name}
                className="text-white text-shadow bg-slate-900/75 hover:bg-slate-900 rounded-r-xl py-1 px-2 absolute bottom-2 left-0"
              />
            )}
          </div>
          <div className="mx-auto px-4 sm:px-6 md:max-w-2xl md:px-4 lg:px-0">
            <div className="flex flex-col items-start">
              <h2 className="mt-2 text-lg font-bold ">
                <Link href={`${slug}`}>{title}</Link>
              </h2>
              <time
                dateTime={publishedAt}
                className="order-first text-sm leading-7 opacity-80"
              >
                {getReadableDate(publishedAt)}
              </time>
              <p className="mt-1 text-base leading-7 opacity-85">{excerpt}</p>
              <div className="mt-4 flex items-center gap-4 justify-between">
                <Link
                  className="flex items-center text-sm font-bold leading-6 text-pink-500 hover:text-pink-700 active:text-pink-900"
                  href={`${slug}`}
                >
                  Read More
                </Link>
                <span
                  aria-hidden="true"
                  className="text-sm font-bold text-slate-400"
                >
                  •
                </span>
                <span className="flex items-center gap-x-3 text-sm leading-6 opacity-50">
                  {stats?.reading_time} read
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
};
