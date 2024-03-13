import { FC } from 'react';
import { HomePostsProps } from 'types/pageTypes';

import formatDate from '@/lib/utils/formatDate';

import Link from '@/components/Link';

import { Layout } from './layout';
import { Tag } from './tag';

export const HomePosts: FC<HomePostsProps> = ({ posts }) => {
  const displayPosts = posts.rows.map((it) => {
    const ret = {
      date: it.publishedAt,
      title: it.title,
      summary: it.excerpt,
      tags: (it.tags as any).rows.map((it) => it.name),
      slug: it.slug,
      readingTime: it.stats?.reading_time,
    };

    return ret;
  });

  return (
    <Layout>
      <div className="divide-y">
        <div className="space-y-2 pt-6 pb-8 md:space-y-5">
          <h1 className="text-3xl font-extrabold leading-9 tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl sm:leading-10 md:text-5xl md:leading-14">
            All Posts
          </h1>
        </div>
        <ListLayout displayPosts={displayPosts} />
      </div>
    </Layout>
  );
};

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
