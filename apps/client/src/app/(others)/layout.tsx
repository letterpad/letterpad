import { isInMaintenanceModeEnabled } from 'ui/server';

import { Navbar } from '../../components/navbar';
import { getData } from '../../data';

const Layout = async ({ children }) => {
  const isInMaintenanceMode = await isInMaintenanceModeEnabled();
  if (isInMaintenanceMode) {
    return <>{children}</>;
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
