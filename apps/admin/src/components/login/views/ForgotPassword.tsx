import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";

import { EventAction, track } from "@/track";

import { Logo } from "./Logo";
import { forgotPasswordAction } from "../actions";

export const ForgotPassword = ({
  isVisible,
  hideSelf,
}: {
  isVisible: boolean;
  hideSelf: () => void;
}) => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const forgotPassword = async () => {
    if (email.trim() === "") return false;
    track({
      eventAction: EventAction.Click,
      eventCategory: "forgot-password",
      eventLabel: `before-request`,
    });
    const result = await forgotPasswordAction(email);
    if (result) {
      router.push("/login");
    }
  };

  if (!isVisible) return null;

  return (
    <>
      <div className="bg-white dark:bg-gray-900">
        <div className="flex h-screen justify-center">
          <div
            className="hidden bg-cover lg:block lg:w-2/3"
            style={{
              backgroundImage:
                "url(https://images.unsplash.com/photo-1634979149798-e9a118734e93?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1769&q=80)",
            }}
          >
            <div className="flex h-full items-center bg-gray-900 bg-opacity-40 px-20">
              <div>
                <h2 className="text-4xl font-bold text-white">Letterpad</h2>

                <p className="mt-3 max-w-xl text-gray-300">
                  Reset your password.
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
                  Reset your password
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
                    placeholder="example@example.com"
                    className="mt-2 block w-full rounded-md border border-gray-200 bg-white px-4 py-2 text-gray-700 placeholder-gray-400 focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-400 focus:ring-opacity-40 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:placeholder-gray-600 dark:focus:border-blue-400"
                  />
                </div>

                <div className="mt-6">
                  <button
                    className="w-full transform rounded-md bg-blue-500 px-4 py-2 tracking-wide text-white transition-colors duration-200 hover:bg-blue-400 focus:bg-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-50"
                    data-testid="loginBtn"
                    onClick={forgotPassword}
                  >
                    Reset Password
                  </button>
                </div>

                <p className="mt-6 text-center text-sm text-gray-400">
                  Rememebered your password ?{" "}
                  <Link
                    href="#"
                    className="text-blue-500 hover:underline focus:underline focus:outline-none"
                  >
                    <a
                      onClick={(e) => {
                        e.preventDefault();
                        hideSelf();
                      }}
                    >
                      Login
                    </a>
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
