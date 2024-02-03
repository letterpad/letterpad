import Header from "../../components/header/Header";
import Footer from "../../components/website/Footer";

const Layout = ({ children }) => {
  return (
    <>
      <Header />
      <div className="px-4 md:px-0">
        <div className="flex flex-col justify-between">{children}</div>
      </div>
      <Footer />
    </>
  );
};

export default Layout;
