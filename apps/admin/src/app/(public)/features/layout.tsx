import { Metadata } from "next";

import Header from "@/components/header/Header";
import Footer from "@/components/website/Footer";

export const metadata: Metadata = {
  title: "Letterpad Features",
};

const Layout = ({ children }) => {
  return (
    <div
      className="flex flex-col justify-between min-h-screen"
      style={{
        background:
          "radial-gradient(ellipse 80% 50% at 50% -20%,rgba(120,119,198,0.3),transparent)",
      }}
    >
      <Header displayBg={false} />
      <div className="md:px-0 flex-1">
        <div className="flex flex-col justify-between">{children}</div>
      </div>
      <Footer />
    </div>
  );
};

export default Layout;
