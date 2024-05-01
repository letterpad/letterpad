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
    <div
      style={{
        background:
          "radial-gradient(84% 79% at 50% -25%, rgb(113 138 243 / 70%), transparent)",
      }}
    >
      <Header displayBg={false} />
      <div className="mb-20">{children}</div>
      <Footer />
    </div>
  );
};

export default Layout;
