"use client";

import React, { useEffect, useState } from "react";

import { ForgotPassword } from "@/components/login/views/ForgotPassword";
import { LoginForm } from "@/components/login/views/LoginForm";

import ThemeSwitcher from "../../components/theme-switcher";

const Login = () => {
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
      <div className="login" style={{ height: "100%", flex: 1 }}>
        <LoginForm isVisible={loginView} hideSelf={() => setLoginView(false)} />

        <ForgotPassword
          hideSelf={() => setLoginView(true)}
          isVisible={!loginView}
        />
      </div>
    </>
  );
};
export default Login;
