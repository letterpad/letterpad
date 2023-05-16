import React, { useEffect } from "react";

import ThemeSwitcher from "../theme-switcher";

const LoginLayout = ({ children }) => {
  useEffect(() => {
    if (typeof localStorage !== "undefined") {
      if (localStorage.theme === "dark") {
        ThemeSwitcher.switch("dark");
      }
    }
  }, []);
  return (
    <>
      <div className="">{children}</div>
      <div className="p-6">Letterpad ©2023, An Open Source Project</div>
    </>
  );
};

export default LoginLayout;
