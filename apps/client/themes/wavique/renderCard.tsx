'use client';
import { PostsFragmentFragment } from 'letterpad-sdk';
import { FC } from 'react';
import { Image } from 'ui/dist/isomorphic.mjs';

import formatDate from '@/lib/utils/formatDate';

import { IconBook } from '@/components/icons';
import Link from '@/components/Link';

import { Tag } from './tag';

export function RenderCard({ post }) {
  const tags = post.tags.rows
    .filter((tag) => tag.name.startsWith('_topic_'))
    .map((it) => it.name);

  return (
    <li className="group w-full">
      <Link
        className="block overflow-hidden rounded-2xl bg-white/[0.7] dark:bg-white/[0.15]  group-hover:shadow-xl transition hover:scale-[1.01] dark:hover:shadow-slate-800 duration-100 ease-in-out"
        href={post.slug ?? ''}
      >
        <div className="relative max-h-4 overflow-hidden pb-60">
          <span>
            <Image
              className=""
              src={post.cover_image.src ?? ''}
              alt={post.title}
              style={{ objectFit: 'cover' }}
            />
          </span>
          <div className="h-16 absolute bottom-0 z-10 left-0">
            <div className="flex flex-wrap gap-2 mt-4 mb-2">
              {tags.map((tag, i) => (
                <Tag
                  key={i}
                  text={tag}
                  className="text-white text-shadow bg-slate-900/75 hover:bg-slate-900 rounded-r-xl py-2 px-4"
                />
              ))}
            </div>
          </div>
        </div>
        <div className="px-6 py-4">
          <div className="h-16">
            <h3
              className={'mb-2 mt-2 font-bold text-lg leading-6 line-clamp-2'}
            >
              {post.title}
            </h3>
          </div>
          <div className="h-32">
            <p className="text-sm tracking-tight text-gray-600 dark:text-gray-300 line-clamp-4 leading-6">
              {post.excerpt}
            </p>
          </div>

          <div className="my-2 opacity-60 inline-flex w-full items-center justify-between">
            <span className="flex items-center gap-1 text-sm">
              <IconBook />
              {post.stats?.reading_time} read
            </span>

            <time dateTime={post.publishedAt} className="text-sm">
              {formatDate(post.publishedAt)}
            </time>
          </div>
        </div>
      </Link>
    </li>
  );
}
