import { FC } from 'react';
import { HomePostsProps } from 'types/pageTypes';

import formatDate from '@/lib/utils/formatDate';

import { IconBook } from '@/components/icons';
import Image from '@/components/Image';
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
      <div className="divide-y">
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
        (
          {
            date,
            title,
            summary,
            tags,
            slug,
            readingTime,
            coverImage,
            publishedAt,
          },
          i
        ) => {
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
        className="c-card block overflow-hidden rounded-2xl bg-white/[0.7] hover:bg-white dark:bg-white/[0.15] dark:hover:bg-white/[0.05]"
        href={slug ?? ''}
      >
        <div className="relative max-h-4 overflow-hidden pb-60">
          <span>
            <Image
              className="transform transition duration-400 group-hover:scale-[1.02]"
              src={coverImage ?? ''}
              fill={true}
              alt={title}
              style={{ objectFit: 'cover' }}
            />
          </span>
        </div>
        <div className="h-48 p-4 ">
          <span className="inline-flex w-full items-center justify-between">
            <span className="flex items-center gap-1 text-sm">
              <IconBook />
              {readingTime} read
            </span>

            <time dateTime={publishedAt} className="text-sm">
              {formatDate(publishedAt)}
            </time>
          </span>

          <h4 className={'mb-2 mt-2 font-bold leading-5'}>{title}</h4>
          <p className="text-base tracking-tight text-gray-600 dark:text-gray-300">
            {summary}
          </p>
        </div>
      </Link>
    </li>
  );
}

function ListLayout({ displayPosts }) {
  return (
    <ol
      className="pt-8 pb-8 m-auto max-w-4xl list-decimal ps-6 sm:marker:text-lg"
      reversed={true}
    >
      {!displayPosts.length && 'No posts found.'}
      {displayPosts.map(
        ({ date, title, summary, tags, slug, readingTime }, i) => {
          return (
            <PostCard
              key={slug}
              {...{ date, title, summary, tags, slug, readingTime }}
            />
          );
        }
      )}
    </ol>
  );
}

function PostCard({ date, title, tags, slug }) {
  return (
    <li key={slug} className="py-2">
      <article className="flex flex-col gap-2 sm:text-lg">
        <div className="flex flex-wrap gap-2">
          <Link
            href={`${slug}`}
            className="underline decoration-primary-500 underline-offset-4 text-primary font-normal hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            {title}
          </Link>
          <dl className="">
            <dt className="sr-only">Published on</dt>
            <dd className="text-gray-500 dark:text-gray-400">
              <time dateTime={date}>{formatDate(date)}</time>
            </dd>
          </dl>
          {tags.map((tag) => (
            <Tag key={tag} text={tag} />
          ))}
        </div>
      </article>
    </li>
  );
}
