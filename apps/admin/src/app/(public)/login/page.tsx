"use client";

import { useSearchParams } from "next/navigation";
import React from "react";

import { AuthForm } from "../../../components/auth";

const Login = () => {
  const params = useSearchParams();
  const source = params.get("source") || "/";
  return (
    <div className="bg-white dark:bg-gray-900 flex justify-center  flex-1">
      <AuthForm source={source} className="!max-w-lg p-8" view="login" />
    </div>
  );
};
export default Login;
