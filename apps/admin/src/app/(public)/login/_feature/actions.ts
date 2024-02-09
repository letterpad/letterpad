import { signIn } from "next-auth/react";
import { Message } from "ui";

import { basePath } from "@/constants";

type LoginResult = {
  success: boolean;
  message: string;
  redirectUrl?: string;
};

export const doLogin = async ({
  email,
  password,
  callbackUrl,
}: {
  email: string;
  password: string;
  callbackUrl?: string | null;
}): Promise<LoginResult> => {
  Message().loading({ content: "Please wait..." });
  const result = await signIn("credentials", {
    redirect: false,
    password: password,
    email: email,
    callbackUrl: callbackUrl ?? basePath + "/posts",
  });
  if (result && result["error"]) {
    return {
      success: false,
      message: result["error"],
    };
  }
  if (result && result["ok"]) {
    return {
      success: true,
      message: "Verified",
      redirectUrl: result.url ?? "",
    };
  }
  return {
    success: false,
    message: "Something wrong happened.",
  };
};
