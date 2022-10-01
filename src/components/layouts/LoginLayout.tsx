import { Layout } from "antd";
import React, { useEffect } from "react";

import ThemeSwitcher from "../theme-switcher";
const { Footer } = Layout;

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
      <div className="content">{children}</div>
      <Footer className="footer">
        Letterpad ©2022, An Open Source Project
      </Footer>
    </>
  );
};

export default LoginLayout;
