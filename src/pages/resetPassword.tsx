import { message } from "antd";
import Head from "next/head";
import { useRouter } from "next/router";
import React, { useState } from "react";

import { Logo } from "@/components/login/views/Logo";
import NoSsr from "@/components/NoSsr";

import {
  ResetPasswordDocument,
  ResetPasswordMutation,
  ResetPasswordMutationVariables,
} from "@/__generated__/queries/mutations.graphql";
import { apolloBrowserClient } from "@/graphql/apolloBrowserClient";
import { EventAction, track } from "@/track";

const key = "change-password";

const ResetPassword = () => {
  const router = useRouter();
  const [newPassword, setNewPassword] = useState("");

  const resetPassword = async () => {
    if (newPassword.length === 0) {
      message.error({
        content: "Password cannot be empty",
        duration: 5,
        key,
      });
      return;
    }

    if (!router.query.token) {
      message.error({
        content: "Token is missing",
        duration: 5,
        key,
      });
      return;
    }

    track({
      eventAction: EventAction.Click,
      eventCategory: "reset-password",
      eventLabel: "with-token",
    });

    const result = await apolloBrowserClient.mutate<
      ResetPasswordMutation,
      ResetPasswordMutationVariables
    >({
      mutation: ResetPasswordDocument,
      variables: {
        token: router.query.token as string,
        password: newPassword,
      },
    });

    const data = result.data?.resetPassword;
    if (data && data.ok) {
      message.success({
        content: data.message,
        duration: 10,
        key,
      });
      router.push("/login");
    } else if (!data?.ok) {
      message.error({
        content:
          data?.message ||
          "There was a problem making this request. Contact the admin.",
        duration: 5,
        key,
      });
    }
  };

  return (
    <NoSsr>
      <Head>
        <title>Login</title>
      </Head>
      <div>
        <div className="bg-white dark:bg-gray-900">
          <div className="flex justify-center h-screen">
            <div
              className="hidden bg-cover lg:block lg:w-2/3"
              style={{
                backgroundImage:
                  "url(https://images.unsplash.com/photo-1634979149798-e9a118734e93?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1769&q=80)",
              }}
            >
              <div className="flex items-center h-full px-20 bg-gray-900 bg-opacity-40">
                <div>
                  <h2 className="text-4xl font-bold text-white">Letterpad</h2>

                  <p className="max-w-xl mt-3 text-gray-300">
                    Your last step to start writing.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center w-full max-w-md px-6 mx-auto lg:w-2/6">
              <div className="flex-1">
                <div className="text-center">
                  <h2 className="text-4xl font-bold text-center text-gray-700 dark:text-white">
                    <Logo />
                  </h2>

                  <p className="mt-3 text-gray-500 dark:text-gray-300">
                    Reset your password
                  </p>
                </div>

                <div className="mt-8">
                  <div>
                    <label
                      htmlFor="password"
                      className="block mb-2 text-sm text-gray-600 dark:text-gray-200"
                    >
                      Enter a new password
                    </label>
                    <input
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value.trim())}
                      type="email"
                      name="email"
                      id="email"
                      data-testid="email"
                      placeholder="example@example.com"
                      className="block w-full px-4 py-2 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-md dark:placeholder-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-700 focus:border-blue-400 dark:focus:border-blue-400 focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40"
                    />
                  </div>

                  <div className="mt-6">
                    <button
                      className="w-full px-4 py-2 tracking-wide text-white transition-colors duration-200 transform bg-blue-500 rounded-md hover:bg-blue-400 focus:outline-none focus:bg-blue-400 focus:ring focus:ring-blue-300 focus:ring-opacity-50"
                      data-testid="loginBtn"
                      onClick={resetPassword}
                    >
                      Reset Password
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </NoSsr>
  );
};
ResetPassword.isLogin = true;
export default ResetPassword;
