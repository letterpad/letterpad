import { RegisterStep } from "letterpad-graphql";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import React, { useEffect, useState } from "react";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import { Message } from "ui";

import { EventAction, track } from "@/track";

import { useCreateAuthor } from "./api.client";
import { Logo, SocialLogin } from "../../login/_feature";

const hasCaptchaKey = process.env.RECAPTCHA_KEY_CLIENT ?? null;

export const RegisterForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<null | Record<string, string>>(null);
  const { executeRecaptcha } = useGoogleReCaptcha();
  const { createAuthor } = useCreateAuthor();

  const router = useRouter();

  useEffect(() => {
    signOut({
      redirect: false,
    });
  }, []);

  const registerAction = async () => {
    setError(null);
    Message().loading({
      content: "Please wait",
      duration: 10,
    });
    let errors = {};
    if (executeRecaptcha) {
      const token = hasCaptchaKey ? await executeRecaptcha("register") : "";
      const formWithToken = { email, token, password };
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
      if (Object.keys(errors).length > 0) {
        setError(errors);
        Message().destroy();
        return;
      }
      const result = await createAuthor({
        data: {
          ...formWithToken,
        },
      });
      const createdAuthor = result.data?.createAuthor;
      if (createdAuthor?.__typename === "Failed") {
        Message().error({
          content: createdAuthor.message,
          duration: 5,
        });
      } else if (createdAuthor?.__typename === "Author") {
        if (
          createdAuthor.register_step &&
          createdAuthor.register_step !== RegisterStep.Registered &&
          createdAuthor.verified
        ) {
          // aquire session
          // return doLogin({ email, password });
        }

        track({
          eventAction: EventAction.Click,
          eventCategory: "register",
          eventLabel: `success`,
        });
        Message().success({ content: "Succcess", duration: 5 });
        router.push("/messages/registered");
      }
    } else {
      Message().error({
        content: "Please enable recaptcha",
        duration: 10,
      });
    }
  };
  return (
    <>
      <div className="bg-white dark:bg-gray-900">
        <div className="flex h-screen justify-center">
          <div
            className="hidden bg-cover lg:block lg:w-2/3"
            style={{
              backgroundImage:
                "url(https://images.unsplash.com/photo-1606625058344-64612c845754?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80)",
            }}
          >
            <div className="flex h-full items-center bg-gray-900 bg-opacity-10 px-20">
              <div>
                <h2 className="text-4xl font-bold text-white">Letterpad</h2>

                <p className="mt-3 max-w-xl text-gray-300">
                  Register to create your own blog. It&apos;s free.
                </p>
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
                  Register your free account
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
                  <p className="text-rose-400">{error?.email}</p>
                </div>

                <div className="mt-6">
                  <div className="mb-2 flex justify-between">
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
                    data-testid="password"
                    className="mt-2 block w-full rounded-md border border-gray-200 bg-white px-4 py-2 text-gray-700 placeholder-gray-400 focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-400 focus:ring-opacity-40 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:placeholder-gray-600 dark:focus:border-blue-400"
                  />
                  <p className="text-rose-400">{error?.password}</p>
                </div>
                <div className="mt-6">
                  <button
                    className="w-full transform rounded-md bg-blue-500 px-4 py-2 tracking-wide text-white transition-colors duration-200 hover:bg-blue-400 focus:bg-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-50"
                    data-testid="registerBtn"
                    onClick={registerAction}
                  >
                    Register
                  </button>
                </div>
                <hr className="my-8 h-px border-0 bg-gray-200 dark:bg-gray-700" />
                <SocialLogin mode="register" />
                <p className="mt-6 text-center text-sm text-gray-400">
                  Already have an account ?{" "}
                  <Link
                    href="/login"
                    className="text-blue-500 hover:underline focus:underline focus:outline-none"
                  >
                    Sign in
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
