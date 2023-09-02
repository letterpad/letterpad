import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Login | Letterpad",
  description: "Login to Letterpad",
  viewport: "width=device-width",
  robots: "follow, index",
};

const LoginLayout = ({ children }) => {
  return (
    <>
      <div className="">{children}</div>
      <div className="p-6">Letterpad ©2023, An Open Source Project</div>
    </>
  );
};

export default LoginLayout;
