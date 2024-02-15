"use client";

import React from "react";
import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3";

import { RegisterForm } from "@/app/(public)/register/_feature";

const Register = () => {
  return (
    <>
      <div className="register" style={{ height: "100%", flex: 1 }}>
        <RegisterForm />
      </div>
    </>
  );
};

const Page = () => {
  const recaptchaKey = process.env.NEXT_PUBLIC_RECAPTCHA_KEY;
  if (!recaptchaKey) return <Register />;
  return (
    <GoogleReCaptchaProvider reCaptchaKey={recaptchaKey}>
      <Register />
    </GoogleReCaptchaProvider>
  );
};

export default Page;
