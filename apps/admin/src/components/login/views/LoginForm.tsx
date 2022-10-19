import { message } from "antd";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";

import { basePath } from "@/constants";
import { EventAction, track } from "@/track";

import { Logo } from "./Logo";
import { SocialLogin } from "./SocialLogin";
import { doLogin } from "../actions";
import { key } from "../constants";
export const LoginForm = ({
  isVisible,
  hideSelf,
}: {
  isVisible: boolean;
  hideSelf: () => void;
}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const router = useRouter();

  const loginAction = async () => {
    const result = await doLogin({ email, password });
    track({
      eventAction: EventAction.Click,
      eventCategory: "login",
      eventLabel: `User logged in`,
    });

    if (result.success && result.redirectUrl) {
      message.success({ key, content: result.message, duration: 3 });
      const { callbackUrl } = router.query;
      let redirectPath = "/posts";
      if (callbackUrl && typeof callbackUrl === "string") {
        redirectPath = new URL(callbackUrl).pathname;
      }
      if (redirectPath.includes("login")) {
        redirectPath = redirectPath.replace("login", "posts");
      }
      router.push(redirectPath.replace(basePath, ""));
      return;
    }
    message.error({ key, content: result.message, duration: 5 });
  };

  if (!isVisible) {
    return null;
  }

  return (
    <>
      <div className="bg-white dark:bg-gray-900">
        <div className="flex h-screen justify-center">
          <div
            className="hidden bg-cover lg:block lg:w-2/3"
            style={{
              backgroundImage:
                "url(https://images.unsplash.com/photo-1505682634904-d7c8d95cdc50?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80)",
            }}
          >
            <div className="flex h-full items-center bg-gray-900 bg-opacity-40 px-20">
              <div>
                <h2 className="text-4xl font-bold text-white">Letterpad</h2>

                <p className="mt-3 max-w-xl text-gray-300">
                  Another Day, Another Story
                </p>
              </div>
            </div>
          </div>

          <div className="mx-auto flex w-full max-w-md items-center px-6 lg:w-2/6">
            <div className="flex-1">
              <div className="text-center">
                <h2 className="text-center text-4xl font-bold text-gray-700 dark:text-white">
                  <Logo />
                </h2>

                <p className="mt-3 text-gray-500 dark:text-gray-300">
                  Sign in to access your account
                </p>
              </div>

              <div className="mt-8">
                <div>
                  <label
                    htmlFor="email"
                    className="mb-2 block text-sm text-gray-600 dark:text-gray-200"
                  >
                    Email Address
                  </label>
                  <input
                    value={email}
                    onChange={(e) => setEmail(e.target.value.trim())}
                    type="email"
                    name="email"
                    id="email"
                    data-testid="email"
                    placeholder="example@example.com"
                    className="mt-2 block w-full rounded-md border border-gray-200 bg-white px-4 py-2 text-gray-700 placeholder-gray-400 focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-400 focus:ring-opacity-40 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:placeholder-gray-600 dark:focus:border-blue-400"
                  />
                </div>

                <div className="mt-6">
                  <div className="mb-2 flex justify-between">
                    <label
                      htmlFor="password"
                      className="text-sm text-gray-600 dark:text-gray-200"
                    >
                      Password
                    </label>
                    <a
                      onClick={hideSelf}
                      href="#"
                      className="text-sm text-gray-400 hover:text-blue-500 hover:underline focus:text-blue-500"
                    >
                      Forgot password?
                    </a>
                  </div>

                  <input
                    value={password}
                    onChange={(e) => setPassword(e.target.value.trim())}
                    type="password"
                    name="password"
                    id="password"
                    data-testid="password"
                    placeholder="Your Password"
                    className="mt-2 block w-full rounded-md border border-gray-200 bg-white px-4 py-2 text-gray-700 placeholder-gray-400 focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-400 focus:ring-opacity-40 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:placeholder-gray-600 dark:focus:border-blue-400"
                  />
                </div>

                <div className="mt-6">
                  <button
                    className="w-full transform rounded-md bg-blue-500 px-4 py-2 tracking-wide text-white transition-colors duration-200 hover:bg-blue-400 focus:bg-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-50"
                    data-testid="loginBtn"
                    onClick={loginAction}
                  >
                    Sign in
                  </button>
                </div>
                <hr className="my-8 h-px border-0 bg-gray-200 dark:bg-gray-700" />
                <SocialLogin mode={"login"} />
                <p className="mt-6 text-center text-sm text-gray-400">
                  Don&#x27;t have an account yet?{" "}
                  <Link
                    href="/register"
                    className="text-blue-500 hover:underline focus:underline focus:outline-none"
                  >
                    <a>Sign up</a>
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
