import formatDate from '@/lib/utils/formatDate';
import { IconBook } from '../../components/icons';

export const PublishedAt = ({ publishedAt, className, reading_time }) => (
  <dl className={className + ' ' + 'text-gray-500 dark:text-gray-400'}>
    <dt className="sr-only">Published on</dt>
    <dd className=" font-medium leading-6 ">
      <time dateTime={publishedAt}>{formatDate(publishedAt)}</time>
    </dd>
    <span className="flex items-center gap-1">
      <IconBook />
      {reading_time} min read
    </span>
  </dl>
);
