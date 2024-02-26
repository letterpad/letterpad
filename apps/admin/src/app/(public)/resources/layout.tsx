import { Metadata } from "next";

import Header from "@/components/header/Header";
import Footer from "@/components/website/Footer";

export const metadata: Metadata = {
  title: "Resources",
  description:
    "Helpful guides for getting started and getting the most out of Letterpad.",
};

const Layout = ({ children }) => {
  return (
    <>
      <Header />
      <div className="mb-20">{children}</div>
      <Footer />
    </>
  );
};

export default Layout;
