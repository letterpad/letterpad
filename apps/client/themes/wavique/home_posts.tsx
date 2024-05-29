import { FC } from 'react';
import { HomePostsProps } from 'types/pageTypes';
import { Image } from 'ui/dist/isomorphic.mjs';

import formatDate from '@/lib/utils/formatDate';

import { IconBook } from '@/components/icons';
import Link from '@/components/Link';

import { Layout } from './layout';
import { Tag } from './tag';

export const HomePosts: FC<HomePostsProps> = ({ posts }) => {
  const displayPosts = posts.rows.map((it) => {
    const ret = {
      date: it.publishedAt,
      coverImage: it.cover_image.src,
      title: it.title,
      summary: it.excerpt,
      tags: (it.tags as any).rows.map((it) => it.name),
      slug: it.slug,
      readingTime: it.stats?.reading_time,
      publishedAt: it.publishedAt,
    };

    return ret;
  });

  return (
    <Layout>
      <div className="divide-y pb-16">
        <GridLayout displayPosts={displayPosts} />
      </div>
    </Layout>
  );
};

function GridLayout({ displayPosts }) {
  return (
    <ul className="grid grid-cols-1 gap-8 py-12 md:grid-cols-2 xl:grid-cols-3">
      {!displayPosts.length && 'No posts found.'}
      {displayPosts.map(
        ({
          date,
          title,
          summary,
          tags,
          slug,
          readingTime,
          coverImage,
          publishedAt,
        }) => {
          return (
            <GridPostCard
              key={slug}
              {...{
                date,
                title,
                summary,
                tags,
                slug,
                readingTime,
                coverImage,
                publishedAt,
              }}
            />
          );
        }
      )}
    </ul>
  );
}

function GridPostCard({
  date,
  title,
  tags,
  summary,
  slug,
  coverImage,
  readingTime,
  publishedAt,
}) {
  return (
    <li className="group w-full">
      <Link
        className="block overflow-hidden rounded-2xl bg-white/[0.7] dark:bg-white/[0.15]  group-hover:shadow-xl transition hover:scale-[1.01] dark:hover:shadow-slate-800 duration-100 ease-in-out"
        href={slug ?? ''}
      >
        <div className="relative max-h-4 overflow-hidden pb-60">
          <span>
            <Image
              className=""
              src={coverImage ?? ''}
              alt={title}
              style={{ objectFit: 'cover' }}
            />
          </span>
          <div className="h-16 absolute bottom-0 z-10 left-0">
            <div className="flex flex-wrap gap-2 mt-4 mb-2">
              {tags
                .filter((it) => it.startsWith('_topic_'))
                .map((tag, i) => (
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
              {title}
            </h3>
          </div>
          <div className="h-32">
            <p className="text-sm tracking-tight text-gray-600 dark:text-gray-300 line-clamp-4 leading-6">
              {summary}
            </p>
          </div>

          <div className="my-2 opacity-60 inline-flex w-full items-center justify-between">
            <span className="flex items-center gap-1 text-sm">
              <IconBook />
              {readingTime} read
            </span>

            <time dateTime={publishedAt} className="text-sm">
              {formatDate(publishedAt)}
            </time>
          </div>
        </div>
      </Link>
    </li>
  );
}
