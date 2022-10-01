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
                  Reset your password.
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
                </div>

                <div className="mt-6">
                  <button
                    className="w-full px-4 py-2 tracking-wide text-white transition-colors duration-200 transform bg-blue-500 rounded-md hover:bg-blue-400 focus:outline-none focus:bg-blue-400 focus:ring focus:ring-blue-300 focus:ring-opacity-50"
                    data-testid="loginBtn"
                    onClick={forgotPassword}
                  >
                    Reset Password
                  </button>
                </div>

                <p className="mt-6 text-sm text-center text-gray-400">
                  Rememebered your password ?{" "}
                  <Link
                    href="#"
                    className="text-blue-500 focus:outline-none focus:underline hover:underline"
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
