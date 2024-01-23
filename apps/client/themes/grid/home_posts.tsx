import classNames from 'classnames';
import { FC } from 'react';

import formatDate from '@/lib/utils/formatDate';

import { IconBook } from '@/components/icons';
import Image from '@/components/Image';
import Link from '@/components/Link';

// import { SectionContainer } from './commons/section';
// import { PageTitle } from './commons/title';
import { HomePostsProps } from '../../types/pageTypes';
import { SectionContainer } from '../../src/components/section';

export const HomePosts: FC<HomePostsProps> = ({ posts, settings }) => {
  return (
    <>
      <SectionContainer className="mx-auto max-w-7xl md:px-20">
        <div className="grid grid-cols-1 gap-8 py-12 md:grid-cols-2 xl:grid-cols-3">
          {posts?.rows.map((post, index) => {
            const { slug, publishedAt, title, excerpt, cover_image, stats } =
              post;
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
                        fill={true}
                        alt={title}
                        style={{ objectFit: 'cover' }}
                        priority={index === 1}
                      />
                    </span>
                  </div>
                  <div className="h-44 px-2 py-4 md:px-0">
                    <span className="inline-flex w-full items-center justify-between">
                      <span className="flex items-center gap-1 text-sm">
                        <IconBook />
                        {stats?.reading_time} min read
                      </span>

                      <time dateTime={publishedAt} className="text-sm">
                        {formatDate(publishedAt)}
                      </time>
                    </span>

                    <h2 className={classNames('mb-2 mt-2 font-bold leading-5')}>
                      {title}
                    </h2>
                    <p className="text-base tracking-tight text-gray-600 dark:text-gray-300">
                      {excerpt}
                    </p>
                  </div>
                </Link>
              </div>
            );
          })}
        </div>
      </SectionContainer>
    </>
  );
};
