"use client";
import Head from "next/head";
import React, { useState } from "react";

import { ForgotPassword } from "@/components/login/views/ForgotPassword";
import { LoginForm } from "@/components/login/views/LoginForm";

const Login = () => {
  const [loginView, setLoginView] = useState(true);

  return (
    <>
      <Head>
        <title>Login</title>
      </Head>
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
