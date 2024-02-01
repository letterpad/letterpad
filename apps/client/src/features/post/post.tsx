import classNames from 'classnames';
import Image from 'next/image';
import { FC } from 'react';

import kebabCase from '@/lib/utils/kebabCase';

import Comments from '@/components/comments';
import Link from '@/components/Link';

import { Like } from '../../components/like';
import { PageView } from '../../components/pageView';
import { PostAuthor } from '../../components/postAuthor';
import { PrismHighlight } from '../../components/prism-highlight';
import { PublishedAt } from '../../components/published-at';
import ScrollTop from '../../components/scroll-top';
import { SectionContainer } from '../../components/section';
import { PageTitle } from '../../components/title';
import { PostProps } from '../../../types/pageTypes';

export const Post: FC<PostProps> = ({ post, settings }) => {
  const { title, tags, author, type, sub_title, id } = post;

  if (author?.__typename !== 'Author') return null;

  const isPage = type === 'page';
  return (
    <SectionContainer>
      <ScrollTop />
      <div className="mx-auto flex w-full  max-w-2xl justify-between pt-10 flex-col">
        <article className="post format-blue dark:format-invert mx-auto w-full">
          <header className={'mb-4 lg:mb-4'}>
            <PageTitle className="leading-10">{title}</PageTitle>
            <PostSubTitle text={sub_title} />
            <div className="flex flex-col py-4">
              <PostAuthor settings={settings} post={post} />
            </div>
            <div className="flex justify-between border-t border-b border-slate-200 dark:border-slate-800 py-2 my-4 px-2">
              <PublishedAt
                publishedAt={post.publishedAt}
                reading_time={post.reading_time!}
                className="flex-row flex gap-2 justify-center text-sm md:text-md items-center"
                separator={<span className="">•</span>}
              />
              {!isPage && <Like postId={id} likes={post.likes} />}
            </div>
            {post.cover_image.src && (
              <img
                src={post.cover_image.src}
                loading="lazy"
                alt={post.title}
                className="py-4"
                style={{ minHeight: 200 }}
              />
            )}
          </header>
          <div className={`prose pb-4 pt-4 dark:prose-dark`}>
            <div dangerouslySetInnerHTML={{ __html: post.html ?? '' }}></div>
          </div>
          <div className="pb-4">
            {tags?.__typename === 'TagsNode' &&
              tags.rows.map(({ name }) => (
                <Link
                  href={`/tag/${kebabCase(name)}`}
                  key={name}
                  className="mr-1 bg-green-100 text-green-800 text-sm font-medium me-2 px-2.5 py-0.5 rounded-full dark:bg-green-900 dark:text-green-300"
                >
                  {name.split(' ').join('-')}
                </Link>
              ))}
          </div>
          {settings.display_author_info && !isPage && author.bio && (
            <div
              className={
                'my-10 mr-3 flex items-center rounded-lg border bg-gray-100 p-4 text-sm text-gray-900 shadow-sm dark:border-gray-900 dark:bg-black dark:bg-opacity-20 dark:text-white'
              }
            >
              <div className="mr-4 hidden md:block">
                {author.avatar && (
                  <Image
                    src={author.avatar}
                    width={100}
                    height={100}
                    alt={author.name}
                    className="rounded-full border-4 dark:border-gray-800"
                    style={{
                      objectFit: 'cover',
                      maxWidth: 100,
                      padding: 10,
                      height: 100,
                    }}
                  />
                )}
              </div>
              <div className="flex flex-col gap-2">
                <Link
                  href="/about"
                  rel="author"
                  className="font-sans text-xl font-extrabold text-gray-900 dark:text-white "
                >
                  {author.name}
                </Link>
                <p className="text-md font-medium leading-5 text-gray-500 dark:text-gray-300">
                  {author.signature}
                </p>
              </div>
            </div>
          )}
          {type === 'post' && <Comments provider="utterances" />}
        </article>
      </div>
      <PrismHighlight />
      {!isPage && <PageView id={id} type="post" />}
    </SectionContainer>
  );
};

interface Props {
  text?: string | null;
  className?: string;
}

export default function PostSubTitle({ text, className }: Props) {
  if (!text) return null;
  const textColor = className ?? 'text-gray-400 dark:text-slate-400';
  return (
    <h1
      className={classNames(
        'py-2 text-lg font-medium  leading-7',
        className,
        textColor
      )}
    >
      {text}
    </h1>
  );
}
