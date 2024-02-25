"use client";

import Cookie from "js-cookie";
import React, { useEffect } from "react";
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
  useEffect(() => {
    if (
      new URLSearchParams(document.location.search).get("sourcePage") ===
      "pricing"
    ) {
      Cookie.set("loginRedirect", "pricing");
    }
  }, []);
  const recaptchaKey = process.env.NEXT_PUBLIC_RECAPTCHA_KEY;
  if (!recaptchaKey) return <Register />;
  return (
    <GoogleReCaptchaProvider reCaptchaKey={recaptchaKey}>
      <Register />
    </GoogleReCaptchaProvider>
  );
};

export default Page;
