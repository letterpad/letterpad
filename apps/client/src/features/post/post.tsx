import classNames from 'classnames';
import { FC, lazy, Suspense } from 'react';
import { SlBadge } from 'react-icons/sl';

import kebabCase from '@/lib/utils/kebabCase';

import Link from '@/components/Link';

import { LikeProvider } from '../like/context';
import { Like } from '../like/like';
import { PostFooter } from '../../app/(others)/post/[slug]/post-footer';
import { PostAuthor } from '../../components/postAuthor';
import { PublishedAt } from '../../components/published-at';
import ScrollTop from '../../components/scroll-top';
import { SectionContainer } from '../../components/section';
import { SubscribeToMyBlogPopup } from '../../components/subscribePopup';
import { PageTitle } from '../../components/title';
import { Share } from '../../../components/share';
import { getApiRootUrl } from '../../../lib/utils/url';
import { PostProps } from '../../../types/pageTypes';

const Comments = lazy(() => import('@/components/comments'));

export const Post: FC<PostProps> = ({ post, settings }) => {
  const { title, tags, author, type, sub_title, featured } = post;

  if (author?.__typename !== 'Author') return null;

  const isPage = type === 'page';
  return (
    <SectionContainer>
      <ScrollTop />
      <LikeProvider likes={post.likes} postId={post.id}>
        <div className="mx-auto flex w-full  max-w-3xl justify-between pt-10 flex-col">
          <article className="post format-blue dark:format-invert mx-auto w-full">
            <header className={'mb-4 lg:mb-4'}>
              {featured && (
                <span className="bg-blue-100 text-blue-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded-full dark:bg-blue-900 dark:text-blue-300 inline-flex items-center gap-1">
                  <SlBadge />
                  Featured
                </span>
              )}
              <PageTitle className="leading-10">{title}</PageTitle>
              <PostSubTitle text={sub_title} />
              <div className="flex flex-col py-4">
                <PostAuthor settings={settings} post={post} />
              </div>
              <div
                id="like-bar"
                className="flex justify-between border-t border-b border-slate-200 dark:border-slate-800 py-2 my-4 px-2"
              >
                <PublishedAt
                  publishedAt={post.publishedAt}
                  reading_time={post.reading_time!}
                  className="flex-row flex gap-2 justify-center text-sm items-center"
                  separator={<span className="">•</span>}
                />
                {!isPage && <Like />}
              </div>
              {post.cover_image.src && (
                <img
                  src={post.cover_image.src}
                  loading="lazy"
                  alt={post.title}
                  className="py-4"
                  style={{ minHeight: 200, width: '100%' }}
                />
              )}
            </header>
            <div
              className={`prose pb-4 pt-4 dark:prose-dark`}
              id="article-content"
            >
              <div dangerouslySetInnerHTML={{ __html: post.html ?? '' }}></div>
            </div>
            <div className="pb-4 flex gap-2 flex-wrap leading-11">
              {tags?.__typename === 'TagsNode' &&
                tags.rows.map(({ name }) => (
                  <Link
                    href={`/tag/${kebabCase(name)}`}
                    key={name.replace('_topic_', '')}
                    className="bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300 active:bg-blue-700 px-5 py-2 text-sm leading-5 rounded-full font-semibold text-white"
                  >
                    {name.split(' ').join('-')}
                  </Link>
                ))}
            </div>
            {settings.display_author_info && !isPage && author.bio && (
              <div className="my-20 flex flex-col">
                <span className="mb-2">Author</span>
                <div className="inline-flex mr-3 text-gray-900 dark:text-white py-4 border-t dark:border-slate-800">
                  <Link
                    href={new URL(
                      `@${author.username}`,
                      getApiRootUrl()
                    ).toString()}
                    rel={author.name}
                    className="contents"
                  >
                    <img
                      className="mr-4 w-16 h-16 rounded-full object-cover"
                      src={author.avatar!}
                      alt="Jese Leos"
                    />
                  </Link>
                  <div>
                    <Link
                      href={new URL(
                        `@${author.username}`,
                        getApiRootUrl()
                      ).toString()}
                      rel={author.name}
                      className="text-xl font-bold text-gray-900 dark:text-white"
                    >
                      {author.name}
                    </Link>
                    <p className="text-gray-500 dark:text-gray-200 text-md">
                      {author.signature}
                    </p>
                  </div>
                </div>
              </div>
            )}
            {!isPage && <SubscribeToMyBlogPopup />}
            {type === 'post' && (
              <Suspense fallback={<div>Loading Comments...</div>}>
                <Comments postId={post.id} />
              </Suspense>
            )}
          </article>
        </div>

        {!isPage && (
          <PostFooter
            author={{
              name: author.name,
              avatar: author.avatar!,
            }}
            likes={post.likes}
            postId={post.id}
            share={
              <Share
                title={title}
                summary={sub_title}
                url={`${settings.site_url}${post.slug}`}
              />
            }
          />
        )}
      </LikeProvider>
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
    <h4
      className={classNames(
        'py-2 text-lg font-medium  leading-7 font-body',
        className,
        textColor
      )}
    >
      {text}
    </h4>
  );
}
