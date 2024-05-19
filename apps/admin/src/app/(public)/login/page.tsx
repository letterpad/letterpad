"use client";

import React from "react";

import { AuthForm } from "../../../components/auth";

const Login = () => {
  const serviceUrl = "/api/identity/login";
  const source = "/login";
  return (
    <div className="bg-white dark:bg-gray-900 flex justify-center  flex-1">
      <AuthForm
        serviceUrl={serviceUrl}
        source={source}
        className="!max-w-lg p-8"
      />
    </div>
  );
};
export default Login;
