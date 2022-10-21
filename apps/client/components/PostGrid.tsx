import React from 'react';

import { PostsFragmentFragment } from '@/lib/graphql';
import formatDate from '@/lib/utils/formatDate';
import kebabCase from '@/lib/utils/kebabCase';

import Image from '@/components/Image';
import Link from '@/components/Link';

interface Props {
  posts: PostsFragmentFragment;
}

const PostGrid: React.VFC<Props> = ({ posts }) => {
  return (
    <div className="container mx-auto">
      <div className="grid grid-cols-1 gap-8 py-12 md:grid-cols-2 xl:grid-cols-3">
        {posts.__typename === 'PostsNode' &&
          posts.rows.map((post) => {
            const { slug, publishedAt, title, tags, excerpt, cover_image, reading_time } = post;
            return (
              <div
                key={slug}
                className="bg-day dark:bg-night group w-full bg-opacity-50 dark:bg-opacity-50"
              >
                <Link
                  className="c-card block transform overflow-hidden rounded-lg bg-transparent transition duration-500 group-hover:scale-105"
                  href={slug ?? ''}
                >
                  <div className="relative max-h-4 overflow-hidden rounded-lg pb-60">
                    <span>
                      <Image src={cover_image.src ?? ''} layout="fill" alt={title} />
                    </span>
                  </div>
                  <div className="py-4">
                    <span className="inline-flex w-full items-center justify-between">
                      <span>{reading_time}</span>

                      <time dateTime={publishedAt} className="text-sm font-semibold">
                        {formatDate(publishedAt)}
                      </time>
                    </span>
                    <h2 className="mt-2 mb-2 font-bold md:text-xl">{title}</h2>
                    <p className="text-sm tracking-wider text-gray-600 dark:text-gray-300">
                      {excerpt}
                    </p>
                    {tags?.__typename === 'TagsNode' &&
                      tags.rows.map(({ name }) => (
                        <Link href={`/tag/${kebabCase(name)}`} key={name}>
                          <a className="mt-4 mr-1 inline-block rounded border border-gray-700 py-1 px-2 text-xs font-medium">
                            {name.split(' ').join('-')}
                          </a>
                        </Link>
                      ))}
                  </div>
                </Link>
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default PostGrid;
