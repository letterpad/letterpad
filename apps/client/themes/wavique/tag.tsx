'use client';

import kebabCase from '@/lib/utils/kebabCase';

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

  const onClick = () => {
    window.location.href = `/tag/${kebabCase(text)}`;
  };
  return (
    <span
      onClick={onClick}
      className={`text-xs font-medium uppercase ${className}`}
    >
      {tag}
    </span>
  );
};
