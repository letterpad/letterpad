import Head from "next/head";
import React, { useEffect, useState } from "react";

import { setIntroDimissed } from "@/components/home/visibility";
import { ForgotPassword } from "@/components/login/views/ForgotPassword";
import { LoginForm } from "@/components/login/views/LoginForm";
import { LoginFormDemo } from "@/components/login/views/LoginFormDemo";
import NoSsr from "@/components/NoSsr";

const Login = () => {
  const [loginView, setLoginView] = useState(true);

  const isDemo =
    typeof document !== "undefined" && document.location.search === "?demo";

  useEffect(() => {
    setIntroDimissed(false);
  }, []);
  return (
    <NoSsr>
      <Head>
        <title>Login</title>
      </Head>
      <div className="login" style={{ height: "100%", flex: 1 }}>
        {isDemo ? (
          <LoginFormDemo isVisible={loginView} />
        ) : (
          <LoginForm
            isVisible={loginView}
            hideSelf={() => setLoginView(false)}
          />
        )}
        <ForgotPassword
          hideSelf={() => setLoginView(true)}
          isVisible={!loginView}
        />
      </div>
    </NoSsr>
  );
};
Login.isLogin = true;
export default Login;
