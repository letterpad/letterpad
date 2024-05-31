/* eslint-disable jsx-a11y/anchor-has-content */
import Link from 'next/link';
import { AnchorHTMLAttributes, DetailedHTMLProps } from 'react';

const CustomLink = ({
  href,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  ref,
  ...rest
}: DetailedHTMLProps<
  AnchorHTMLAttributes<HTMLAnchorElement>,
  HTMLAnchorElement
>) => {
  const isInternalLink = href && href.startsWith('/');
  const isAnchorLink = href && href.startsWith('#');

  if (isInternalLink) {
    return (
      <Link href={href} {...rest} prefetch={false}>
        {/* <a {...rest} /> */}
      </Link>
    );
  }

  if (isAnchorLink) {
    return <a href={href} {...rest} />;
  }

  return <a target="_blank" rel="noopener noreferrer" href={href} {...rest} />;
};

export default CustomLink;
