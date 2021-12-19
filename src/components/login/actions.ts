import { message } from "antd";
import { basePath } from "@/constants";
import { getSession, signIn } from "next-auth/react";
import { SessionData } from "@/graphql/types";
import { LoginError } from "@/__generated__/__types__";
import { getApolloClient } from "@/graphql/apollo";
import {
  ForgotPasswordDocument,
  ForgotPasswordMutation,
} from "@/__generated__/queries/mutations.graphql";
import { ForgotPasswordMutationVariables } from "@/graphql/queries/mutations.graphql";
import { key } from "./constants";

type SessionResponse = { user: LoginError | SessionData };

type LoginResult = {
  success: boolean;
  message: string;
  redirectUrl?: string;
};

export const doLogin = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}): Promise<LoginResult> => {
  message.loading({ content: "Please wait...", key });
  const result = await signIn("credentials", {
    redirect: false,
    password: password,
    email: email,
    callbackUrl: basePath + "/pages",
  });
  if (result && result["error"]) {
    return {
      success: false,
      message: result["error"],
    };
  }
  const session = (await getSession()) as SessionResponse | null;
  if (!session) {
    return {
      success: false,
      message: "The request could not be processed at this time.",
    };
  }
  if (session.user.__typename === "LoginError") {
    return {
      success: false,
      message: session.user.message,
    };
  }
  if (session.user.__typename === "SessionData") {
    return {
      success: true,
      message: "Verified",
      redirectUrl:
        result && result["url"] ? result["url"] : basePath + "/posts",
    };
  }
  return {
    success: false,
    message: "Something wrong happened.",
  };
};

export const forgotPasswordAction = async (
  e: React.MouseEvent<HTMLButtonElement>,
  email: string,
) => {
  e.preventDefault();
  const sanitisedLoginEmail = email.trim();
  if (sanitisedLoginEmail.length > 0) {
    e.currentTarget.disabled = true;
    const client = await getApolloClient();
    const res = await client.mutate<
      ForgotPasswordMutation,
      ForgotPasswordMutationVariables
    >({
      mutation: ForgotPasswordDocument,
      variables: {
        email: email,
      },
    });
    const data = res.data?.forgotPassword;

    if (data?.ok) {
      message.success("Check your email to reset your password!");
      return true;
    } else {
      e.currentTarget.disabled = false;
      message.warn(
        data?.message || "Something wrong hapenned. Please try again.",
      );
    }
  } else {
    message.warn("Email field is mandatory");
  }
  return false;
};
