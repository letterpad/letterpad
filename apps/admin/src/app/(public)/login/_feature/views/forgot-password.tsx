import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Message } from "ui";

import { EventAction, EventCategory, EventLabel, track } from "@/track";

import { useForgotPassword } from "../client.api";
import { Logo } from "../logo";

export const ForgotPassword = ({
  isVisible,
  hideSelf,
}: {
  isVisible: boolean;
  hideSelf: () => void;
}) => {
  const router = useRouter();
  const [waiting, setWaiting] = useState(false);
  const [email, setEmail] = useState("");
  const { forgotPassword } = useForgotPassword();

  const tryForgotPassword = async () => {
    setWaiting(true);
    track({
      eventAction: EventAction.Click,
      eventCategory: EventCategory.Auth,
      eventLabel: EventLabel.ForgotPassword,
    });

    try {
      const sanitisedLoginEmail = email.trim();
      if (sanitisedLoginEmail.length > 0) {
        const { data } = await forgotPassword({ email });
        if (data?.forgotPassword.ok) {
          Message().success({
            content: "Check your email to reset your password!",
          });
          router.push("/login");
        } else {
          Message().warn({
            content:
              data?.forgotPassword.message ||
              "Something wrong hapenned. Please try again.",
          });
        }
      } else {
        Message().warn({ content: "Email field is mandatory" });
      }
    } catch (e) {}
    setWaiting(false);
  };

  if (!isVisible) return null;

  return (
    <>
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

            <p className="mt-3 max-w-xl text-gray-300">Reset your password.</p>
          </div>
        </div>
      </div>

      <div className="mx-auto flex w-full max-w-md items-center px-6 lg:w-2/6">
        <div className="flex-1">
          <div className="text-center">
            <h2 className="flex justify-center text-4xl font-bold text-gray-700 dark:text-white">
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
                disabled={waiting}
                onClick={tryForgotPassword}
              >
                Reset Password
              </button>
            </div>

            <p className="mt-6 text-center text-sm text-gray-400">
              Rememebered your password ?{" "}
              <Link
                href="#"
                className="text-blue-500 hover:underline focus:underline focus:outline-none"
                onClick={(e) => {
                  e.preventDefault();
                  hideSelf();
                }}
              >
                Login
              </Link>
              .
            </p>
          </div>
        </div>
      </div>
    </>
  );
};
