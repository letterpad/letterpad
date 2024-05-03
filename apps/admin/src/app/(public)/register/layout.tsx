"use client";

import Footer from "../../../components/website_v2/Footer";

const LoginLayout = ({ children }) => {
  return (
    <>
      <title>Letterpad - Register</title>
      <div className="">{children}</div>
      <Footer />
    </>
  );
};

export default LoginLayout;
