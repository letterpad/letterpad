import Head from "next/head";
import React from "react";

import { Feature } from "@/features/reset-password";

const ResetPassword = () => {
  return (
    <>
      <Head>
        <title>Login</title>
      </Head>
      <div>
        <div className="bg-white dark:bg-gray-900">
          <div className="flex h-screen justify-center">
            <Feature />
          </div>
        </div>
      </div>
    </>
  );
};
export default ResetPassword;
