import { ReactNode, useEffect } from 'react';

import { PageQueryWithHtmlQuery } from '@/lib/graphql';

import Comments from '@/components/comments';
import Image from '@/components/Image';
import Link from '@/components/Link';
import PageTitle from '@/components/PageTitle';
import ScrollTop from '@/components/ScrollTop';
import SectionContainer from '@/components/SectionContainer';
import { BlogSEO } from '@/components/SEO';
import { Share } from '@/components/share';
import Tag from '@/components/Tag';

const postDateTemplate: Intl.DateTimeFormatOptions = {
  weekday: 'long',
  year: 'numeric',
  month: 'long',
  day: 'numeric',
};

interface Props {
  data: PageQueryWithHtmlQuery;
  next?: { slug: string; title: string };
  prev?: { slug: string; title: string };
  children: ReactNode;
}

declare global {
  interface Window {
    Prism: Record<string, () => void>;
  }
}

export default function PostLayout({ data, next, prev, children }: Props) {
  const { post, settings, me } = data;

  useEffect(() => {
    if (typeof window.Prism !== 'undefined') {
      window.Prism.highlightAll();
    }
  }, [data]);

  if (
    post.__typename !== 'Post' ||
    settings.__typename !== 'Setting' ||
    me?.__typename !== 'Author'
  ) {
    return null;
  }

  const { slug, publishedAt, title, excerpt, updatedAt, cover_image, tags, author, type } = post;
  if (author?.__typename !== 'Author') return null;
  const authorDetails = [
    {
      name: author.name,
      avatar: author.avatar,
      occupation: me.occupation,
      company: me.company_name,
      email: settings.site_email,
      twitter: me.social?.twitter,
      linkedin: me.social?.linkedin,
      github: me.social?.github,
      banner: settings.banner?.src,
      logo: settings.site_logo?.src,
    },
  ];
  const postUrl = `${settings.site_url}${slug}`;
  return (
    <SectionContainer>
      <BlogSEO
        url={postUrl}
        authorDetails={authorDetails}
        date={publishedAt}
        title={title}
        summary={excerpt ?? ''}
        lastmod={updatedAt}
        images={cover_image.src ? [cover_image.src] : []}
        slug={slug ?? ''}
        tags={tags?.__typename === 'TagsNode' ? tags.rows.map((t) => t.name) : []}
        fileName={title}
        canonicalUrl={postUrl}
        site_name={settings.site_title}
      />
      <ScrollTop />
      <article>
        <div className="xl:divide-y xl:divide-gray-200 xl:dark:divide-gray-700">
          <header className="pt-6 xl:pb-6">
            <div className="space-y-1 text-center">
              <dl className="space-y-10">
                <div>
                  <dt className="sr-only">Published on</dt>
                  <dd className="text-base font-medium leading-6 text-gray-500 dark:text-gray-400">
                    <time dateTime={publishedAt}>
                      {new Date(publishedAt).toLocaleDateString('en-US', postDateTemplate)}
                    </time>
                  </dd>
                </div>
              </dl>
              <div>
                <PageTitle>{title}</PageTitle>
              </div>
            </div>
          </header>
          <div
            className="divide-y divide-gray-200 pb-8 dark:divide-gray-700 xl:grid xl:grid-cols-4 xl:gap-x-6 xl:divide-y-0"
            style={{ gridTemplateRows: 'auto 1fr' }}
          >
            <dl className="pt-6 pb-10 xl:border-b xl:border-gray-200 xl:pt-11 xl:dark:border-gray-700">
              <dt className="sr-only">Authors</dt>
              <dd>
                <ul className="flex justify-center space-x-8 sm:space-x-12 xl:block xl:space-x-0 xl:space-y-8">
                  <li className="flex items-center space-x-2" key={author.name}>
                    {author.avatar && (
                      <Image
                        src={author.avatar}
                        width="38px"
                        height="38px"
                        alt="avatar"
                        className="h-10 w-10 rounded-full"
                      />
                    )}
                    <dl className="whitespace-nowrap text-sm font-medium leading-5">
                      <dt className="sr-only">Name</dt>
                      <dd className="text-gray-900 dark:text-gray-100">{author.name}</dd>
                      <dt className="sr-only">Twitter</dt>
                      <dd>
                        {me.social?.twitter && (
                          <Link href={me.social.twitter} className="link">
                            {me.social.twitter.replace('https://twitter.com/', '@')}
                          </Link>
                        )}
                      </dd>
                    </dl>
                  </li>
                  {/* ))} */}
                </ul>
              </dd>
            </dl>
            <div className="divide-y divide-gray-200 dark:divide-gray-700 xl:col-span-3 xl:row-span-2 xl:pb-0">
              <div className="prose max-w-none pt-10 pb-8 dark:prose-dark">{children}</div>
              {type === 'post' && <Comments provider="utterances" />}
            </div>
            <footer>
              <div className="divide-gray-200 text-sm font-medium leading-5 dark:divide-gray-700 xl:col-start-1 xl:row-start-2 xl:divide-y">
                <div className="flex flex-row justify-between xl:flex-col">
                  {tags?.__typename === 'TagsNode' && tags.rows.length > 0 && (
                    <div className="py-4 xl:py-4">
                      <h2 className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
                        Tags
                      </h2>
                      <div className="flex flex-wrap">
                        {tags.rows.map((tag) => (
                          <Tag key={tag.name} text={tag.name} />
                        ))}
                      </div>
                    </div>
                  )}
                  <div className="py-4 xl:py-4">
                    <h2 className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
                      Share
                    </h2>
                    <div className="mt-2 flex flex-wrap">
                      <Share title={title} summary={excerpt} url={postUrl} />
                    </div>
                  </div>
                </div>
                {(next || prev) && (
                  <div className="flex justify-between py-4 xl:block xl:space-y-8 xl:py-8">
                    {prev && (
                      <div>
                        <h2 className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
                          Previous Article
                        </h2>
                        <div className="link">
                          <Link href={`${prev.slug}`}>{prev.title}</Link>
                        </div>
                      </div>
                    )}
                    {next && (
                      <div>
                        <h2 className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
                          Next Article
                        </h2>
                        <div className="link">
                          <Link href={`${next.slug}`}>{next.title}</Link>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
              <div className="pt-4 xl:pt-8">
                <Link href="/" className="link">
                  &larr; Back to home
                </Link>
              </div>
            </footer>
          </div>
        </div>
      </article>
    </SectionContainer>
  );
}
