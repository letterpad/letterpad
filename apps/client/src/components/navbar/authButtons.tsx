'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';

import { getApiRootUrl } from '../../../lib/utils/url';

export const AuthButtons = () => {
  const [location, setLocation] = useState<string | null>(null);
  const apiRoot = getApiRootUrl();
  const login = new URL(`/api/identity/login`, apiRoot);
  const register = new URL(`/register`, apiRoot);
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setLocation(window.location.href);
    }
  }, []);

  if (location) login.searchParams.set('source', location);
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
