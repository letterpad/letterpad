import { FC, ReactNode } from 'react';

import formatDate from '@/lib/utils/formatDate';

import { IconBook } from '../../components/icons';

interface Props {
  publishedAt: string;
  className?: string;
  reading_time: string;
  separator?: ReactNode;
}

export const PublishedAt: FC<Props> = ({
  publishedAt,
  className,
  reading_time,
  separator,
}) => (
  <dl className={className + ' ' + 'text-gray-500 dark:text-gray-400'}>
    <dt className="sr-only">Published on</dt>
    <dd className=" font-medium leading-6 ">
      <time dateTime={publishedAt}>{formatDate(publishedAt)}</time>
    </dd>
    {separator}
    <span className="flex items-center gap-1">
      <IconBook />
      {reading_time} read
    </span>
  </dl>
);
