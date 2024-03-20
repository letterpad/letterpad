"use client";

import React from "react";

import { Feature } from "@/app/(public)/login/_feature/feature";

const Login = () => {
  return (
    <>
      <div className="login" style={{ height: "100%", flex: 1 }}>
        <div className="bg-white dark:bg-gray-900">
          <div className="flex h-screen justify-center">
            <Feature />
          </div>
        </div>
      </div>
    </>
  );
};
export default Login;
