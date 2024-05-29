import Link from 'next/link';
import { FC } from 'react';
import { Image } from 'ui/dist/isomorphic.mjs';

import { Tag } from './tag';
import { SectionContainer } from '../../src/components/section';
import { getReadableDate } from '../../src/utils';
import { HomePostsProps } from '../../types/pageTypes';

export const HomePosts: FC<HomePostsProps> = ({ posts }) => {
  return (
    <div className="relative">
      <SectionContainer className="px-4">
        <main className="">
          <div className="relative">
            <div className="pb-12 pt-16 sm:pb-4 lg:pt-12">
              <div className="lg:px-8">
                <div className="lg:max-w-4xl">
                  <h1 className="text-2xl font-bold leading-7 ">
                    Latest Posts
                  </h1>
                </div>
              </div>
              <div className="divide-y divide-slate-100 dark:divide-slate-800 sm:mt-4 lg:mt-8 lg:border-t lg:border-slate-100 dark:lg:border-slate-800">
                {posts.rows.map((post) => {
                  return (
                    <Post
                      key={post.id}
                      {...post}
                      date={post.publishedAt}
                      description={post.excerpt}
                      reading_time={post.stats?.reading_time!}
                      coverImage={post.cover_image.src}
                      tags={post.tags?.['rows']}
                      slug={`${post.slug}`}
                    />
                  );
                })}
              </div>
            </div>
          </div>
        </main>
      </SectionContainer>
    </div>
  );
};

const Post = ({
  id,
  title,
  date,
  description,
  reading_time,
  coverImage,
  tags,
  slug,
}) => {
  const topic = tags.find((it) => it.name.startsWith('_topic_'));

  return (
    <article aria-labelledby={`episode-${id}-title`} className="py-10 sm:py-12">
      <div className="lg:px-8">
        <div className="lg:max-w-4xl">
          <div className="relative">
            <Link href={slug}>
              <Image
                src={coverImage}
                alt={title}
                className="mb-8 w-full h-72 object-cover rounded-lg"
                loading="lazy"
              />
            </Link>
            <Tag
              text={topic.name}
              className="text-white text-shadow bg-slate-900/75 hover:bg-slate-900 rounded-r-xl py-1 px-2 absolute bottom-2 left-0"
            />
          </div>
          <div className="mx-auto px-4 sm:px-6 md:max-w-2xl md:px-4 lg:px-0">
            <div className="flex flex-col items-start">
              <h2 className="mt-2 text-lg font-bold ">
                <Link href={slug}>{title}</Link>
              </h2>
              <time
                dateTime={date}
                className="order-first text-sm leading-7 opacity-80"
              >
                {getReadableDate(date)}
              </time>
              <p className="mt-1 text-base leading-7 opacity-85">
                {description}
              </p>
              <div className="mt-4 flex items-center gap-4 justify-between">
                <Link
                  className="flex items-center text-sm font-bold leading-6 text-pink-500 hover:text-pink-700 active:text-pink-900"
                  href={slug}
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
                  {reading_time} read
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
};
