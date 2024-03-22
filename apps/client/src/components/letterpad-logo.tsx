import Image from 'next/image';
import Link from 'next/link';
import { FC } from 'react';

import { getApiRootUrl } from '../../lib/utils/url';

interface Logo {
  __typename?: 'Image';
  className?: string;
}

export const LetterpadLogo: FC<Logo> = ({ className = '' }) => {
  return (
    <span className={className}>
      <Link href={getApiRootUrl()!} aria-label={'Letterpad'}>
        <Image
          alt={'Letterpad'}
          src={getApiRootUrl() + 'logo/lp_logo_white.svg'}
          width={28}
          height={28}
        />
      </Link>
    </span>
  );
};
