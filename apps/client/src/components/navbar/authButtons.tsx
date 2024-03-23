'use client';
import Link from 'next/link';

import { getApiRootUrl } from '../../../lib/utils/url';

export const AuthButtons = () => {
  const location = typeof window !== 'undefined' ? document.location.href : '';
  const apiRoot = getApiRootUrl();

  const login = new URL(`/api/identity/login`, apiRoot);
  login.searchParams.set('source', location);

  const register = new URL(`/register`, apiRoot);
  register.searchParams.set('ref', 'clientHeader');

  return (
    <>
      <Link href={login.href} className="text-sm">
        Login
      </Link>
      <Link href={register.href} className="text-sm">
        Register
      </Link>
    </>
  );
};
