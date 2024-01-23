import { Login, Logout } from '../../../features/auth';
import { cookies, headers } from 'next/headers';

async function getSession() {
  try {
    const header = headers();
    const proto = header.get('x-forwarded-proto');
    const host = header.get('host');
    const siteUrl = `${proto}://${host}`;

    const response = await fetch(`${siteUrl}/api/client/session`, {
      headers: {
        cookie: cookies().toString(),
      },
    });
    const data = await response.json();
    return data;
  } catch (err) {
    return null;
  }
}
const Auth = async () => {
  const session = await getSession();
  return !session ? (
    <Login />
  ) : (
    <>
      {session?.name} <Logout />
    </>
  );
};

export default Auth;
