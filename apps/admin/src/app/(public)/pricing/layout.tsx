import { Metadata } from "next";

import Header from "@/components/header/Header";
import Footer from "@/components/website/Footer";

export const metadata: Metadata = {
  title: "Pricing",
};

const Layout = ({ children }) => {
  return (
    <div
      style={{
        background:
          "radial-gradient(129% 70% at 50% -23%, rgb(113 178 157 / 27%), transparent)",
      }}
    >
      <Header displayBg={false} />
      <div className="px-4 md:px-0 flex-1">
        <div className="flex flex-col justify-between">{children}</div>
      </div>
      <Footer />
    </div>
  );
};

export default Layout;
