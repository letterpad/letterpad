"use client";

import { useEffect, useState } from "react";

import ThemeSwitcher from "@/components/theme-switcher";

import { ForgotPassword } from "./views/forgot-password";
import { LoginForm } from "./views/login-form";

export const Feature = () => {
  const [loginView, setLoginView] = useState(true);
  useEffect(() => {
    if (typeof localStorage !== "undefined") {
      if (localStorage.theme === "dark") {
        ThemeSwitcher.switch("dark");
      }
    }
  }, []);
  return (
    <>
      <LoginForm isVisible={loginView} hideSelf={() => setLoginView(false)} />
      <ForgotPassword
        hideSelf={() => setLoginView(true)}
        isVisible={!loginView}
      />
    </>
  );
};
