import kebabCase from '@/lib/utils/kebabCase';

import Link from '@/components/Link';

export const Tag = ({
  text,
  className,
}: {
  text: string;
  className?: string;
}) => {
  let tag = text;
  if (text.toLowerCase().startsWith('_topic_')) {
    tag = text.replace('_topic_', '');
  } else {
    tag = tag.split(' ').join('-');
  }

  return (
    <Link
      href={`/tag/${kebabCase(text)}`}
      className={`text-xs font-medium uppercase ${className}`}
    >
      {tag}
    </Link>
  );
};
