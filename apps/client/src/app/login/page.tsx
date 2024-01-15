import { getSession } from 'lib/utils/session';
import { Login, Logout } from '../../features/auth';
import { getData } from '../../data';

const Auth = async () => {
  const data = await getData();
  const session = await getSession(data?.settings.site_url);

  return !session ? (
    <Login />
  ) : (
    <>
      {session?.user?.name} <Logout />
    </>
  );
};

export default Auth;
