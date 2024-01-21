import { Login, Logout } from '../../features/auth';
import { cookies, headers } from 'next/headers';

async function getSession() {
  const header = headers();
  const siteUrl = `${header.get('x-forwarded-proto')}://${header.get('host')}`;
  const response = await fetch(`${siteUrl}/api/client/session`, {
    headers: {
      cookie: cookies().toString(),
    },
  });
  const data = await response.json();
  return data;
}
const Auth = async () => {
  const session = await getSession();
  // eslint-disable-next-line no-console
  console.log('Client Auth session', session);
  return !session ? (
    <Login />
  ) : (
    <>
      {session?.user?.name} <Logout />
    </>
  );
};

export default Auth;
