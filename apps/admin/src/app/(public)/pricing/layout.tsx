import { Metadata } from "next";

import Header from "@/components/header/Header";
import Footer from "@/components/website_v2/Footer";

export const metadata: Metadata = {
  title: "Pricing",
};

const Layout = ({ children }) => {
  return (
    <div className="pricing-gradient">
      <Header displayBg={false} />
      <div className="px-4 md:px-0 flex-1">
        <div className="flex flex-col justify-between">{children}</div>
      </div>
      <Footer />
    </div>
  );
};

export default Layout;
