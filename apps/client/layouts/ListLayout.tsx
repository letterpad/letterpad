import { PostsFragmentFragment } from 'letterpad-sdk';

import formatDate from '@/lib/utils/formatDate';

import { IconBook } from '@/components/icons';
import Link from '@/components/Link';
import PageTitle from '@/components/PageTitle';
import SectionContainer from '@/components/SectionContainer';
import Tag from '@/components/Tag';
interface Props {
  posts: PostsFragmentFragment;
  title: string;
}

export default function ListLayout({ posts, title }: Props) {
  return (
    <SectionContainer>
      <div className="content divide-y divide-gray-200 dark:divide-gray-700">
        <div className="space-y-2 pt-6 pb-8 md:space-y-5">
          <PageTitle>{title}</PageTitle>
        </div>
        <ul>
          {/* {!filteredBlogPosts.length && 'No posts found.'} */}
          {posts.rows.map((post) => {
            const { slug, publishedAt, title, tags, excerpt, stats } = post;
            return (
              <li key={slug} className="py-4">
                <article className="space-y-2 xl:grid xl:grid-cols-4 xl:items-baseline xl:space-y-0">
                  <PublishedAt
                    publishedAt={publishedAt}
                    className="text-sm xl:block"
                    reading_time={stats?.reading_time}
                  />
                  <div className="space-y-3 xl:col-span-3">
                    <div>
                      <h3 className="text-2xl font-bold leading-8 tracking-tight">
                        <Link
                          href={`${slug}`}
                          className="text-gray-900 dark:text-gray-100"
                        >
                          {title}
                        </Link>
                      </h3>
                      <div className="flex flex-wrap">
                        {tags?.__typename === 'TagsNode' &&
                          tags.rows.map((tag) => (
                            <Tag key={tag.name} text={tag.name} />
                          ))}
                      </div>
                    </div>
                    <div className="prose max-w-none text-sm leading-6 text-gray-500 dark:text-gray-300">
                      {excerpt}
                    </div>
                  </div>
                </article>
              </li>
            );
          })}
        </ul>
      </div>
    </SectionContainer>
  );
}

const PublishedAt = ({ publishedAt, className, reading_time }) => (
  <dl className={className}>
    <dt className="sr-only">Published on</dt>
    <dd className=" font-medium leading-6 text-gray-500 dark:text-gray-300">
      <time dateTime={publishedAt}>{formatDate(publishedAt)}</time>
    </dd>
    <span className="flex items-center gap-1">
      <IconBook />
      {reading_time} min read
    </span>
  </dl>
);
