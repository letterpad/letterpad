import { IconBook } from '@/components/icons';
import { Share } from '@/components/share';

import { getReadableDate } from '../post';

export const PostAuthor = ({ settings, post }) => {
  const { slug, publishedAt, title, excerpt, tags, author, type, sub_title } =
    post;
  const isPage = type === 'page';

  const postUrl = `${settings.site_url}${slug}`;
  const printPublishedAt = getReadableDate(publishedAt);

  return (
    <address
      className={
        'mb-6 mt-6 flex items-center not-italic ' + (isPage && ' hidden')
      }
    >
      <div className="inline-flex w-full items-center text-sm text-gray-900 dark:text-white">
        {author.avatar && (
          <div className="mr-2">
            <img
              src={author.avatar}
              width={64}
              height={64}
              alt={author.name}
              style={{ objectFit: 'cover' }}
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
          <p className="text-sm font-normal text-gray-500 dark:text-gray-300">
            {author.occupation}
          </p>
          <p className="flex text-sm font-normal text-gray-500 dark:text-gray-300">
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
  );
};
