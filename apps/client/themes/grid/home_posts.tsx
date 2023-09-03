import classNames from 'classnames';
import { FC } from 'react';

import formatDate from '@/lib/utils/formatDate';

import { fonts } from '@/components/fonts';
import { IconBook } from '@/components/icons';
import Image from '@/components/Image';
import Link from '@/components/Link';

import { SectionContainer } from './commons/section';
import { PageTitle } from './commons/title';
import { HomePostsProps } from '../../types/pageTypes';

export const HomePosts: FC<HomePostsProps> = ({ posts, settings }) => {
  return (
    <>
      <div
        className={'bg-accent-50  bg-cover text-white'}
        style={{ backgroundImage: `url(${settings.banner?.src})` }}
      >
        <SectionContainer className="py:10 space-y-2 md:space-y-3 md:py-32">
          <div className="py-10">
            <BrandText
              tagline={settings.site_tagline}
              title={settings.site_title}
              description={settings.site_description}
            />
          </div>
        </SectionContainer>
      </div>
      <SectionContainer>
        <div className="grid grid-cols-1 gap-8 py-12 md:grid-cols-2 xl:grid-cols-3">
          {posts?.rows.map((post) => {
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

                    <h2
                      className={classNames(
                        'mb-2 mt-2 font-bold leading-5',
                        fonts[settings.design?.primary_font ?? 'Inter']
                          .className
                      )}
                    >
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

const BrandText = ({ title, tagline, description }) => {
  return (
    <>
      <PageTitle className="text-center">{title}</PageTitle>
      <p className="pb-4 text-center text-md font-bold leading-6 md:text-md">
        {tagline}
      </p>
      <p
        className="hidden px-4 text-center text-sm font-medium italic leading-6 md:block md:text-md"
        dangerouslySetInnerHTML={{ __html: description }}
      />
    </>
  );
};
