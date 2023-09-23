import classNames from 'classnames';

import formatDate from '@/lib/utils/formatDate';

import { IconBook } from '@/components/icons';

export const PublishedAt = ({ publishedAt, className, reading_time }) => (
  <dl
    className={classNames(
      'space-y-1 text-sm font-semibold uppercase  text-gray-500 dark:text-gray-400',
      className
    )}
  >
    <dt className="sr-only">Published on</dt>
    <dd className=" text-accent-400 hover:text-800 leading-6 tracking-wider transition-colors duration-200">
      <time dateTime={publishedAt}>{formatDate(publishedAt)}</time>
    </dd>
    <span className="flex items-center gap-1 text-xs font-medium">
      <IconBook />
      {reading_time} min read
    </span>
  </dl>
);
