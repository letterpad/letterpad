import Link from 'next/link';

import kebabCase from '@/lib/utils/kebabCase';

interface Props {
  text: string;
}

const Tag = ({ text }: Props) => {
  return (
    <Link
      href={`/tag/${kebabCase(text)}`}
      className="link mr-3 text-sm font-medium uppercase opacity-60 hover:text-accent-50"
    >
      {text.split(' ').join('-')}
    </Link>
  );
};

export default Tag;
