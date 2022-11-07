import React from 'react';

import { PostsFragmentFragment } from '@/lib/graphql';
import formatDate from '@/lib/utils/formatDate';

import Link from '@/components/Link';
import Tag from '@/components/Tag';

interface Props {
  posts: PostsFragmentFragment;
}

const PostList: React.VFC<Props> = ({ posts }) => {
  return (
    <ul className="divide-y divide-gray-200 dark:divide-gray-700">
      {posts.__typename === 'PostsNode' &&
        posts.rows.map((post) => {
          const { slug, publishedAt, title, tags, excerpt } = post;
          const tagsData = tags?.__typename === 'TagsNode' ? tags.rows : [];
          return (
            <li key={slug} className="py-12">
              <article>
                <div className="space-y-2 xl:grid xl:grid-cols-4 xl:items-baseline xl:space-y-0">
                  <dl>
                    <dt className="sr-only">Published on</dt>
                    <dd className="text-base font-medium leading-6 text-gray-500 dark:text-gray-400">
                      <time dateTime={publishedAt}>{formatDate(publishedAt)}</time>
                    </dd>
                  </dl>
                  <div className="space-y-5 xl:col-span-3">
                    <div className="space-y-6">
                      <div>
                        <h2 className="text-2xl font-bold leading-8 tracking-tight">
                          <Link href={`${slug}`} className="text-gray-900 dark:text-gray-100">
                            {title}
                          </Link>
                        </h2>
                        <span className="block text-gray-700 dark:text-gray-300">
                          {post.reading_time} read
                        </span>
                        <div className="mt-1 flex flex-wrap">
                          {tagsData.map((tag) => (
                            <Tag key={tag.name} text={tag.name} />
                          ))}
                        </div>
                      </div>
                      <div className="prose max-w-none text-gray-500 dark:text-gray-400">
                        {excerpt}
                      </div>
                    </div>
                    <div className="text-base font-medium leading-6">
                      <Link href={`${slug}`} className="link" aria-label={`Read "${title}"`}>
                        Read more &rarr;
                      </Link>
                    </div>
                  </div>
                </div>
              </article>
            </li>
          );
        })}
    </ul>
  );
};

export default PostList;
