'use client';
import { useSearchParams } from 'next/navigation';
import { Button } from 'ui';

import { getApiRootUrl } from '@/lib/utils/url';

export const Login = () => {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const onClick = (e: any) => {
    e.preventDefault();
    document.location.href = `${getApiRootUrl()}api/identity/login?source=${
      document.location.href
    }`;
  };
  return <Button onClick={onClick}>Login</Button>;
};
