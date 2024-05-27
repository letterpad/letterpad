"use client";

import React from "react";
import { AuthForm } from "ui/src/components/auth";

const Register = () => {
  const serviceUrl = "/api/identity/login";
  const source = "/register";
  return (
    <div className="bg-white dark:bg-gray-900 flex justify-center  flex-1">
      <AuthForm
        serviceUrl={serviceUrl}
        source={source}
        className="!max-w-lg p-8"
        view="register"
      />
    </div>
  );
};
export default Register;
