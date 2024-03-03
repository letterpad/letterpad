"use client";

import { useState } from "react";

import { ForgotPassword } from "./views/forgot-password";
import { LoginForm } from "./views/login-form";

export const Feature = () => {
  const [loginView, setLoginView] = useState(true);

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
