import React from "react";

import Header from "../header/Header";
import Footer from "../website_v2/Footer";

const StaticLayout = ({ children }) => {
  return (
    <>
      <div className="flex h-screen flex-1 flex-col">
        <Header />
        <div className="flex flex-1 justify-center pt-20">{children}</div>
        <Footer />
      </div>
    </>
  );
};

export default StaticLayout;
