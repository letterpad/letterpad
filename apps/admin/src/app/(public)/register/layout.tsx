"use client";
import React, { useEffect } from "react";

import ThemeSwitcher from "@/components/theme-switcher";

import Footer from "../../../components/website/Footer";

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
      <title>Letterpad - Register</title>
      <div className="">{children}</div>
      <Footer />
    </>
  );
};

export default LoginLayout;
