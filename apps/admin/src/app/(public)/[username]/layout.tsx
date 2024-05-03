import Header from "@/components/header/Header";
import Footer from "@/components/website_v2/Footer";

const Layout = ({ children }) => {
  return (
    <>
      <Header />
      <div>{children}</div>
      <Footer />
    </>
  );
};

export default Layout;
