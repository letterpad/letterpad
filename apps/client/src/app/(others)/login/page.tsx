import { headers } from 'next/headers';

import { getSession } from '@/lib/utils/getSession';

import { Login, Logout } from '@/features/auth';

const Auth = async () => {
  const session = await getSession(headers());
  return !session ? (
    <Login />
  ) : (
    <>
      {session?.name} <Logout />
    </>
  );
};

export default Auth;
