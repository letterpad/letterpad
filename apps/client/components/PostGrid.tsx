import { PostsFragmentFragment } from 'letterpad-sdk';
import React from 'react';

import formatDate from '@/lib/utils/formatDate';
import kebabCase from '@/lib/utils/kebabCase';

import Image from '@/components/Image';
import Link from '@/components/Link';

import { IconBook } from './icons';

interface Props {
  posts: PostsFragmentFragment;
}

const PostGrid: React.VFC<Props> = ({ posts }) => {
  return (
    <div className="container mx-auto">
      <div className="grid grid-cols-1 gap-8 py-12 md:grid-cols-2 xl:grid-cols-3">
        {posts.__typename === 'PostsNode' &&
          posts.rows.map((post) => {
            const {
              slug,
              publishedAt,
              title,
              tags,
              excerpt,
              cover_image,
              stats,
            } = post;
            return (
              <div
                key={slug}
                className="bg-day dark:bg-night group w-full bg-opacity-50 dark:bg-opacity-50"
              >
                <Link
                  className="c-card block transform overflow-hidden rounded-lg bg-transparent transition duration-300 group-hover:scale-[1.02]"
                  href={slug ?? ''}
                >
                  <div className="relative max-h-4 overflow-hidden rounded-lg pb-60">
                    <span>
                      <Image
                        src={cover_image.src ?? ''}
                        layout="fill"
                        alt={title}
                      />
                    </span>
                  </div>
                  <div className="h-44 py-4 px-2 md:px-0">
                    <span className="inline-flex w-full items-center justify-between">
                      <span className="flex items-center gap-1 text-xs">
                        <IconBook />
                        {stats?.reading_time} min read
                      </span>

                      <time dateTime={publishedAt} className="text-xs">
                        {formatDate(publishedAt)}
                      </time>
                    </span>

                    <h2 className="mt-2 mb-2 font-bold">{title}</h2>
                    <p className="text-sm tracking-wider text-gray-600 dark:text-gray-300">
                      {excerpt}
                    </p>
                  </div>
                </Link>
                <div className="px-2 md:px-0">
                  {tags?.__typename === 'TagsNode' &&
                    tags.rows.map(({ name }) => (
                      <Link
                        href={`/tag/${kebabCase(name)}`}
                        key={name}
                        className="mr-1 inline-block text-sm font-medium text-gray-400"
                      >
                        #{name.split(' ').join('-')}
                      </Link>
                    ))}
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default PostGrid;
