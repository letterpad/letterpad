import React, { useState } from "react";
import Head from "next/head";
import { ForgotPassword } from "@/components/login/views/ForgotPassword";
import { LoginForm } from "@/components/login/views/LoginForm";
import { LoginFormDemo } from "@/components/login/views/LoginFormDemo";
import { Header } from "antd/lib/layout/layout";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginView, setLoginView] = useState(true);

  const isDemo =
    typeof document !== "undefined" && document.location.search === "?demo";

  return (
    <>
      <Head>
        <title>Login</title>
      </Head>
      <div className="login" style={{ height: "100vh" }}>
        <Header className="header">
          <div className="logo">
            <img src="uploads/logo.png" height={30} />
          </div>
        </Header>
        {isDemo ? (
          <LoginFormDemo isVisible={loginView} />
        ) : (
          <LoginForm
            email={email}
            isVisible={loginView}
            password={password}
            setEmail={setEmail}
            setPassword={setPassword}
            hideSelf={() => setLoginView(false)}
          />
        )}
        <ForgotPassword
          email={email}
          setEmail={setEmail}
          hideSelf={() => setLoginView(true)}
          isVisible={!loginView}
        />
      </div>
    </>
  );
};

export default Login;
