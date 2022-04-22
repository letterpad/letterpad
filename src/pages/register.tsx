import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3";
import React from "react";
import Head from "next/head";

import { RegisterForm } from "@/components/register/views/RegisterForm";

const Register = () => {
  return (
    <>
      <Head>
        <title>Register</title>
      </Head>
      <div className="register" style={{ height: "100%" }}>
        <RegisterForm />
      </div>
    </>
  );
};

interface Props {
  recaptchaKey: string;
}
const Provider: React.VFC<Props> = ({ recaptchaKey }) => {
  return (
    <GoogleReCaptchaProvider reCaptchaKey={recaptchaKey}>
      <Register />
    </GoogleReCaptchaProvider>
  );
};
//@ts-ignore
Provider.noSession = true;
export default Provider;

export const getServerSideProps = async () => {
  return {
    props: {
      recaptchaKey: process.env.RECAPTCHA_KEY_CLIENT,
    },
  };
};
