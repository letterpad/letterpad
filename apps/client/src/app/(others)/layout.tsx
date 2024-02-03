import { Navbar } from '../../components/navbar';
import { getData } from '../../data';

const Layout = async ({ children }) => {
  const data = await getData();
  if (!data) {
    return null;
  }
  return (
    <>
      <Navbar settings={data.settings} showCollapsedMenu={true} me={data.me} />
      {children}
    </>
  );
};
export default Layout;
