import { Metadata } from "next";

import Header from "../../../components/header/Header";
import Footer from "../../../components/website/Footer";

export const metadata: Metadata = {
  title: "Terms & Conditions",
};

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
