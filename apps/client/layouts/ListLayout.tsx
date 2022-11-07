import { PostsFragmentFragment } from '@/lib/graphql';
import formatDate from '@/lib/utils/formatDate';

import Link from '@/components/Link';
import SectionContainer from '@/components/SectionContainer';
import Tag from '@/components/Tag';
interface Props {
  posts: PostsFragmentFragment;
  title: string;
}

export default function ListLayout({ posts, title }: Props) {
  return (
    <SectionContainer>
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        <div className="space-y-2 pt-6 pb-8 md:space-y-5">
          <h1 className="text-3xl font-extrabold leading-9 tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl sm:leading-10 md:text-6xl md:leading-14">
            {title}
          </h1>
        </div>
        <ul>
          {/* {!filteredBlogPosts.length && 'No posts found.'} */}
          {posts.rows.map((frontMatter) => {
            const { slug, publishedAt, title, tags, excerpt, reading_time } = frontMatter;
            return (
              <li key={slug} className="py-4">
                <article className="space-y-2 xl:grid xl:grid-cols-4 xl:items-baseline xl:space-y-0">
                  <dl>
                    <dt className="sr-only">Published on</dt>
                    <dd className="text-base font-medium leading-6 text-gray-500 dark:text-gray-400">
                      <time dateTime={publishedAt}>{formatDate(publishedAt)}</time>
                      <div>{reading_time}</div>
                    </dd>
                  </dl>
                  <div className="space-y-3 xl:col-span-3">
                    <div>
                      <h3 className="text-2xl font-bold leading-8 tracking-tight">
                        <Link href={`${slug}`} className="text-gray-900 dark:text-gray-100">
                          {title}
                        </Link>
                      </h3>
                      <div className="flex flex-wrap">
                        {tags?.__typename === 'TagsNode' &&
                          tags.rows.map((tag) => <Tag key={tag.name} text={tag.name} />)}
                      </div>
                    </div>
                    <div className="prose max-w-none text-gray-500 dark:text-gray-400">
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
