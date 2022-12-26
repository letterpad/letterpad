import {
  MeFragmentFragment,
  PageFragmentFragment,
  SettingsFragmentFragment,
} from 'letterpad-sdk';
import { ReactNode, useEffect } from 'react';

import kebabCase from '@/lib/utils/kebabCase';

import Comments from '@/components/comments';
import { IconBook } from '@/components/icons';
import Image from '@/components/Image';
import Link from '@/components/Link';
import PageTitle from '@/components/PageTitle';
import ScrollTop from '@/components/ScrollTop';
import SectionContainer from '@/components/SectionContainer';
import { BlogSEO } from '@/components/SEO';
import { Share } from '@/components/share';
// import { Speak } from '@/components/speech/speech';

export const getReadableDate = (timestamp: Date | number) => {
  return new Date(timestamp).toLocaleString('en-us', {
    month: 'short',
    year: 'numeric',
    day: 'numeric',
  });
};

interface Props {
  data: {
    post: PageFragmentFragment;
    settings: SettingsFragmentFragment;
    me: MeFragmentFragment;
  };
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

  const {
    slug,
    publishedAt,
    title,
    excerpt,
    updatedAt,
    cover_image,
    tags,
    author,
    type,
  } = post;
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
  const printPublishedAt = getReadableDate(publishedAt);
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
        tags={
          tags?.__typename === 'TagsNode' ? tags.rows.map((t) => t.name) : []
        }
        fileName={title}
        canonicalUrl={postUrl}
        site_name={settings.site_title}
      />
      <ScrollTop />
      <div className="mx-auto flex max-w-4xl  justify-between pt-10">
        <article className="post format-blue dark:format-invert mx-auto w-full">
          <header className={'mb-4 lg:mb-6'}>
            <address
              className={
                'mb-6 flex items-center not-italic ' + (isPage && ' hidden')
              }
            >
              <div className="inline-flex w-full items-center text-sm text-gray-900 dark:text-white">
                {author.avatar && (
                  <div className="mr-4">
                    <Image
                      loader={({ src }) => src}
                      src={author.avatar}
                      width="64px"
                      height="64px"
                      alt={author.name}
                      className="mr-3  h-16 w-16 rounded-full "
                    />
                  </div>
                )}
                <div className="w-full">
                  <div className="flex flex-1 items-center justify-between">
                    <a
                      href="#"
                      rel="author"
                      className="font-sans text-md font-medium text-gray-900 dark:text-white"
                    >
                      {author.name}
                    </a>
                    <Share
                      title={title}
                      summary={excerpt}
                      url={postUrl}
                      className="hidden md:block"
                    />
                  </div>
                  <p className="text-sm font-light text-gray-500 dark:text-gray-300">
                    {author.occupation}
                  </p>
                  <p className="flex text-sm font-light text-gray-500 dark:text-gray-300">
                    <time title={printPublishedAt}>{printPublishedAt}</time>{' '}
                    &nbsp;•&nbsp;
                    <span className="flex items-center gap-1">
                      <IconBook />
                      {post.stats?.reading_time} min read
                    </span>
                  </p>
                </div>
              </div>
            </address>
            <PageTitle>{title}</PageTitle>
            <div className="text-center">
              {tags?.__typename === 'TagsNode' &&
                tags.rows.map(({ name }) => (
                  <Link
                    href={`/tag/${kebabCase(name)}`}
                    key={name}
                    className="mr-1 inline-block  text-sm  font-bold text-green-600 hover:text-green-500"
                  >
                    #{name.split(' ').join('-')}
                  </Link>
                ))}
            </div>
            {/* <div className="flex items-center justify-center gap-2 py-2 text-center">
              Listen <Speak html={post.html ?? ''} />
            </div> */}
          </header>
          <div className="prose pb-8 pt-4 dark:prose-dark">{children}</div>

          <div
            className={
              'mb-10 mr-3 flex items-center rounded-md border p-8 text-sm text-gray-900 dark:border-gray-800 dark:text-white ' +
              (isPage || !author.bio ? 'hidden' : '')
            }
          >
            <div className="mr-4 hidden md:block">
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
                className="font-sans text-xl font-extrabold text-gray-900 dark:text-white "
              >
                {author.name}
              </a>
              <p className="text-sm font-light text-gray-500 dark:text-gray-300">
                {author.bio}
              </p>
              <p className="text-sm font-light text-gray-500 dark:text-gray-300"></p>
            </div>
          </div>
          {type === 'post' && <Comments provider="utterances" />}
        </article>
      </div>
    </SectionContainer>
  );
}
