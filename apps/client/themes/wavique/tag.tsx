import kebabCase from '@/lib/utils/kebabCase';

import Link from '@/components/Link';

export const Tag = ({
  text,
  className,
}: {
  text: string;
  className?: string;
}) => {
  return (
    <Link
      href={`/tag/${kebabCase(text)}`}
      className={`text-sm bg-gray-100 dark:bg-gray-700 p-1 font-medium uppercase text-primary-700 dark:text-primary-300 hover:text-primary-600 dark:hover:text-primary-400 ${className}`}
    >
      {text.split(' ').join('-')}
    </Link>
  );
};
