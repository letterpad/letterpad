import { message } from "antd";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";

import { Logo } from "@/components/login/views/Logo";
import { SocialLogin } from "@/components/login/views/SocialLogin";

import {
  CreateAuthorDocument,
  useCreateAuthorMutation,
} from "@/__generated__/queries/mutations.graphql";
import { sanitizeUsername } from "@/shared/utils";
import { EventAction, track } from "@/track";

const key = "register";
export const RegisterForm = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [error, setError] = useState<null | Record<string, string>>(null);
  const { executeRecaptcha } = useGoogleReCaptcha();
  const [createAuthor] = useCreateAuthorMutation();

  const [_, setProcessing] = useState(false);

  const router = useRouter();

  const registerAction = async () => {
    setProcessing(true);
    setError(null);
    message.loading({
      content: "Please wait",
      key,
      duration: 5,
    });
    let errors = {};
    if (executeRecaptcha) {
      const token = await executeRecaptcha("register");
      const formWithToken = { email, username, name, token, password };
      if (!username || !sanitizeUsername(username)) {
        errors = {
          ...errors,
          username:
            "Only letters, numbers, underscore, hyphen and dot are allowed",
        };
      }
      if (email.length === 0) {
        errors = {
          ...errors,
          email: "Email cannot be empty",
        };
      }
      if (
        password.length < 8 ||
        password.search(/[a-z]/i) < 0 ||
        password.search(/[0-9]/) < 0
      ) {
        errors = {
          ...errors,
          password:
            "Should be 8 character long and should contain at least one number",
        };
      }
      if (name.length < 3 || name.search(/^([ \u00c0-\u01ffa-zA-Z'-])+$/) < 0) {
        errors = {
          ...errors,
          name: "Should be 3 character long and may contain specific special characters",
        };
      }
      if (Object.keys(errors).length > 0) {
        setProcessing(false);
        setError(errors);
        message.destroy(key);
        return;
      }
      const result = await createAuthor({
        mutation: CreateAuthorDocument,
        variables: {
          data: {
            ...formWithToken,
            setting: { site_title: "My Blog" },
          },
        },
      });
      if (result.data?.createAuthor?.__typename === "Exception") {
        message.error({
          content: result.data?.createAuthor.message,
          key,
          duration: 5,
        });
      } else {
        track({
          eventAction: EventAction.Click,
          eventCategory: "register",
          eventLabel: `success`,
        });
        message.success({ content: "Succcess", key, duration: 5 });
        router.push("/messages/registered");
      }
    }

    setProcessing(false);
  };

  return (
    <>
      <div className="bg-white dark:bg-gray-900">
        <div className="flex justify-center h-screen">
          <div
            className="hidden bg-cover lg:block lg:w-2/3"
            style={{
              backgroundImage:
                "url(https://images.unsplash.com/photo-1606625058344-64612c845754?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80)",
            }}
          >
            <div className="flex items-center h-full px-20 bg-gray-900 bg-opacity-40">
              <div>
                <h2 className="text-4xl font-bold text-white">Letterpad</h2>

                <p className="max-w-xl mt-3 text-gray-300">
                  Register to create your own blog. It&apos;s free.
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
                  Register your free account
                </p>
              </div>
              <div className="mt-8">
                <div>
                  <label
                    htmlFor="name"
                    className="block mb-2 text-sm text-gray-600 dark:text-gray-200"
                  >
                    Name
                  </label>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    type="text"
                    name="email"
                    id="name"
                    placeholder="John Doe"
                    required
                    className="block w-full px-4 py-2 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-md dark:placeholder-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-700 focus:border-blue-400 dark:focus:border-blue-400 focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40"
                  />
                  <p className="text-rose-500">{error?.name}</p>
                </div>
              </div>

              <div className="mt-8">
                <div>
                  <label
                    htmlFor="email"
                    className="block mb-2 text-sm text-gray-600 dark:text-gray-200"
                  >
                    Email Address
                  </label>
                  <input
                    value={email}
                    onChange={(e) => setEmail(e.target.value.trim())}
                    type="email"
                    name="email"
                    id="email"
                    placeholder="example@example.com"
                    className="block w-full px-4 py-2 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-md dark:placeholder-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-700 focus:border-blue-400 dark:focus:border-blue-400 focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40"
                  />
                  <p className="text-rose-400">{error?.email}</p>
                </div>

                <div className="mt-6">
                  <div className="flex justify-between mb-2">
                    <label
                      htmlFor="password"
                      className="text-sm text-gray-600 dark:text-gray-200"
                    >
                      Password
                    </label>
                  </div>

                  <input
                    value={password}
                    onChange={(e) => setPassword(e.target.value.trim())}
                    type="password"
                    name="password"
                    id="password"
                    placeholder="Your Password"
                    className="block w-full px-4 py-2 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-md dark:placeholder-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-700 focus:border-blue-400 dark:focus:border-blue-400 focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40"
                  />
                  <p className="text-rose-400">{error?.password}</p>
                </div>
                <div className="mt-8">
                  <div>
                    <label
                      htmlFor="username"
                      className="block mb-2 text-sm text-gray-600 dark:text-gray-200"
                    >
                      Username
                    </label>
                    <input
                      value={username}
                      onChange={(e) => setUsername(e.target.value.trim())}
                      type="text"
                      name="username"
                      id="username"
                      placeholder="jacksparrow"
                      className="block w-full px-4 py-2 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-md dark:placeholder-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-700 focus:border-blue-400 dark:focus:border-blue-400 focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40"
                    />
                    <p className="text-rose-400">{error?.username}</p>
                  </div>
                </div>
                <div className="mt-6">
                  <button
                    className="w-full px-4 py-2 tracking-wide text-white transition-colors duration-200 transform bg-blue-500 rounded-md hover:bg-blue-400 focus:outline-none focus:bg-blue-400 focus:ring focus:ring-blue-300 focus:ring-opacity-50"
                    data-testid="loginBtn"
                    onClick={registerAction}
                  >
                    Register
                  </button>
                </div>
                <hr className="my-8 h-px bg-gray-200 border-0 dark:bg-gray-700" />
                <SocialLogin mode="register" />
                <p className="mt-6 text-sm text-center text-gray-400">
                  Already have an account ?{" "}
                  <Link
                    href="/login"
                    className="text-blue-500 focus:outline-none focus:underline hover:underline"
                  >
                    <a>Sign in</a>
                  </Link>
                  .
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
