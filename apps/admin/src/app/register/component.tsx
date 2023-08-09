"use client";
import Head from "next/head";
import React from "react";
import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3";

import { RegisterForm } from "@/components/register/views/RegisterForm";

const Register = () => {
  return (
    <>
      <Head>
        <title>Register</title>
      </Head>
      <div className="register" style={{ height: "100%", flex: 1 }}>
        <RegisterForm />
      </div>
    </>
  );
};

interface Props {
  recaptchaKey?: string;
}
const RegsiterWithCaptchaProvier: React.FC<Props> = ({ recaptchaKey }) => {
  if (!recaptchaKey) return <Register />;
  return (
    <GoogleReCaptchaProvider reCaptchaKey={recaptchaKey}>
      <Register />
    </GoogleReCaptchaProvider>
  );
};
export default RegsiterWithCaptchaProvier;
