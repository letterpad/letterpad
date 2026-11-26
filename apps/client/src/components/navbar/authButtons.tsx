'use client';
import Link from 'next/link';
import { startClientSso } from '../../../lib/utils/clientSso';

import { getApiRootUrl } from '../../../lib/utils/url';

export const AuthButtons = () => {
  const register = new URL('/register', getApiRootUrl());
  register.searchParams.set('ref', 'clientHeader');

  return (
    <>
      <button
        type="button"
        onClick={() => startClientSso(true)}
        className="text-sm"
      >
        Login
      </button>
      <Link href={register.href} className="text-sm">
        Register
      </Link>
    </>
  );
};
