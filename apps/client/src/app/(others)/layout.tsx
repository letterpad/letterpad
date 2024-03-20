import { get } from '@vercel/edge-config';

import { Navbar } from '../../components/navbar';
import { getData } from '../../data';

const Layout = async ({ children }) => {
  if (process.env.EDGE_CONFIG) {
    const key =
      process.env.NODE_ENV === 'production'
        ? 'isInMaintenanceMode'
        : 'isInMaintenanceModeDev';
    const isInMaintenanceMode = await get<boolean>(key);
    if (isInMaintenanceMode) {
      return <>{children}</>;
    }
  }
  const data = await getData();
  if (!data) {
    return null;
  }
  return (
    <>
      <Navbar settings={data.settings} me={data.me} />
      {children}
    </>
  );
};
export default Layout;
