import { Metadata } from "next";

import Header from "@/components/header/Header";
import Footer from "@/components/website_v2/Footer";

export const metadata: Metadata = {
  title: "Resources",
  description:
    "Helpful guides for getting started and getting the most out of Letterpad.",
};

const Layout = ({ children }) => {
  return (
    <div className="resource-gradient">
      <Header displayBg={false} />
      <div className="mb-20">{children}</div>
      <Footer />
    </div>
  );
};

export default Layout;
