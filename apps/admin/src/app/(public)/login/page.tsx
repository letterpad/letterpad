"use client";

import { useSearchParams } from "next/navigation";
import React, { useEffect } from "react";
import { AuthForm } from "ui/dist/index.mjs";

const Login = () => {
  const params = useSearchParams();
  const [source, setSource] = React.useState(params.get("source")!);

  useEffect(() => {
    if (!source) {
      setSource(window.location.origin + "/posts");
    }
  }, [source]);

  return (
    <div className="bg-white dark:bg-gray-900 flex justify-center  flex-1">
      <AuthForm source={source} className="!max-w-lg p-8" view="login" />
    </div>
  );
};
export default Login;
