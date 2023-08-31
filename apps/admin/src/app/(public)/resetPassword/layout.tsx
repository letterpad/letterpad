"use client";
import React, { useEffect } from "react";

import ThemeSwitcher from "@/components/theme-switcher";

const LoginLayout = ({ children }) => {
  return (
    <>
      <div className="">{children}</div>
      <div className="p-6">Letterpad ©2023, An Open Source Project</div>
    </>
  );
};

export default LoginLayout;
