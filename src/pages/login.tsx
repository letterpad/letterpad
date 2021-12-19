import React, { useState } from "react";
import { Container } from "@/components/login/login.css";
import Head from "next/head";
import { ForgotPassword } from "@/components/login/views/ForgotPassword";
import { LoginForm } from "@/components/login/views/LoginForm";
import { LoginFormDemo } from "@/components/login/views/LoginFormDemo";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginView, setLoginView] = useState(true);

  const isDemo = document.location.search === "?demo";

  return (
    <Container>
      <Head>
        <title>Login</title>
      </Head>
      <div className="login">
        <h1>Letterpad</h1>
        {!isDemo ? (
          <LoginForm
            email={email}
            isVisible={loginView}
            password={password}
            setEmail={setEmail}
            setPassword={setPassword}
            hideSelf={() => setLoginView(false)}
          />
        ) : (
          <LoginFormDemo isVisible={loginView} />
        )}
        <ForgotPassword
          email={email}
          setEmail={setEmail}
          hideSelf={() => setLoginView(true)}
          isVisible={!loginView}
        />
      </div>
    </Container>
  );
};

export default Login;
