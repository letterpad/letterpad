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
  const printPublishedAt = new Date(publishedAt).toLocaleDateString('en-US', postDateTemplate);
  const isPage = type === 'page';

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
      <div className="mx-auto flex max-w-screen-xl justify-between px-4 pt-10">
        <article className="format format-sm sm:format-base lg:format-lg format-blue dark:format-invert mx-auto w-full max-w-2xl">
          <header className={'mb-4 lg:mb-6'}>
            <address className={'mb-6 flex items-center not-italic' + (isPage && ' hidden')}>
              <div className="mr-3 inline-flex w-full items-center text-sm text-gray-900 dark:text-white">
                <div className="mr-4">
                  {author.avatar && (
                    <Image
                      loader={({ src }) => src}
                      src={author.avatar}
                      width="64px"
                      height="64px"
                      alt={author.name}
                      className="h-16 w-16 rounded-full"
                    />
                  )}
                </div>
                <div className="w-full">
                  <div className="flex flex-1 justify-between">
                    <a
                      href="#"
                      rel="author"
                      className="text-xl font-extrabold text-gray-900 dark:text-white"
                    >
                      {author.name}
                    </a>
                    <Share title={title} summary={excerpt} url={postUrl} />
                  </div>
                  <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                    {author.occupation}
                  </p>
                  <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                    <time title={printPublishedAt}>{printPublishedAt}</time>
                  </p>
                </div>
              </div>
            </address>
            <PageTitle>{title}</PageTitle>
          </header>
          <div className="prose max-w-none pb-8 dark:prose-dark">{children}</div>

          <div
            className={
              'mb-10 mr-3 flex items-center rounded-md border p-8 text-sm text-gray-900 dark:border-gray-800 dark:text-white ' +
              (isPage || !author.bio ? 'hidden' : '')
            }
          >
            <div className="mr-4">
              {author.avatar && (
                <Image
                  loader={({ src }) => src}
                  src={author.avatar}
                  width="94px"
                  height="94px"
                  alt={author.name}
                  className="h-16 w-16 rounded-full"
                />
              )}
            </div>
            <div>
              <a
                href="#"
                rel="author"
                className="text-xl font-extrabold text-gray-900 dark:text-white"
              >
                {author.name}
              </a>
              <p className="text-sm font-light text-gray-500 dark:text-gray-400">{author.bio}</p>
              <p className="text-sm font-light text-gray-500 dark:text-gray-400"></p>
            </div>
          </div>
          {type === 'post' && <Comments provider="utterances" />}
        </article>
      </div>
    </SectionContainer>
  );
}
