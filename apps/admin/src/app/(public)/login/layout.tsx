import { Metadata, Viewport } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Login",
  description: "Login to Letterpad",
  robots: "follow, index",
};

export const viewport: Viewport = {
  themeColor: "black",
  width: "device-width",
};

const LoginLayout = ({ children }) => {
  return (
    <>
      <div className="">{children}</div>
      <div className="p-6">Letterpad ©2024, An Open Source Project</div>
    </>
  );
};

export default LoginLayout;
