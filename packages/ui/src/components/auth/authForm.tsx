"use client"
import classNames from "classnames";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FC, MouseEvent, useState } from "react";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import { SubmitHandler, useForm } from "react-hook-form";

import { onLoginAction, onRegisterAction } from "./action";
import { CaptchaProvider } from "./captchaProvider";
import { SocialLogin } from "./social-login";
import { Button } from "../button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../cardv2";
import { Input } from "../input";

interface FormProps {
  email: string;
}
type AuthViews = "login" | "register" | "success";

interface Props {
  source: string;
  className?: string;
  view: AuthViews;
  border?: boolean;
  changeRouteOnViewChange?: boolean;
}

const recaptchaKey = process.env.NEXT_PUBLIC_RECAPTCHA_KEY;

export const AuthForm: FC<Props> = ({
  source,
  className,
  view: type,
  border = true,
  changeRouteOnViewChange = true,
}) => {
  const [busy, setBusy] = useState(false);
  const params = useSearchParams();
  const { register, handleSubmit } = useForm<FormProps>();
  const [view, setView] = useState<AuthViews>(type);
  const { executeRecaptcha } = useGoogleReCaptcha();
  const router = useRouter();
  const isLoginView = view === "login";
  const isRegisterView = view === "register";
  const isSuccessView = view === "success";
  const serviceUrl = params.get("serviceUrl") || "";

  const onSubmit: SubmitHandler<FormProps> = async (data) => {
    setBusy(true);
    let captchaToken = "";
    try {
      if (view === "login") {
        const result = await onLoginAction({ data, serviceUrl, source });
        if(result?.ok && result.status === 200) {
          setView("success")
        }
      } else if (view === "register") {
        if (executeRecaptcha && !!recaptchaKey) {
          captchaToken = await executeRecaptcha("register");
        }
        const result = await onRegisterAction({ data, captchaToken });
        if(result?.ok && result.status === 200) {
          setView("success")
        }
      }
    } catch (e) {
      // console.error(e);
    }
    setBusy(false);
  };

  const switchView = (view: AuthViews) => (e: MouseEvent) => {
    e.preventDefault();
    if (changeRouteOnViewChange) {
      if (view === "login") router.push("/login");
      if (view === "register") router.push("/register");
    } else {
      setView(view);
    }
  };

  const renderFormContent = () => {
    switch (view) {
      case "register":
        return (
          <>
            <CaptchaProvider>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                required
                label="Email"
                data-testid="email"
                {...register("email", {
                  required: true,
                  maxLength: 100,
                  minLength: 6,
                })}
              />
              <Button disabled={busy} type="submit" className="w-full">
                Continue
              </Button>
              <SocialLogin mode="register" />
              <div className="mt-4 text-center text-sm">
                Already have an account?{" "}
                <Link
                  href="#"
                  className="underline"
                  onClick={switchView("login")}
                >
                  Sign in
                </Link>
              </div>
            </CaptchaProvider>
          </>
        );
      case "login":
        return (
          <>
            <Input
              id="email"
              type="email"
              placeholder="m@example.com"
              required
              label="Email"
              data-testid="email"
              {...register("email")}
            />

            <Button disabled={busy} type="submit" className="w-full">
              Continue
            </Button>
            <SocialLogin mode="login" />
            <div className="mt-4 text-center text-sm">
              Don&apos;t have an account?{" "}
              <Link
                href="#"
                className="underline"
                onClick={switchView("register")}
              >
                Create one
              </Link>
            </div>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex items-center justify-center w-full px-6"
    >
      <Card
        className={classNames("m-auto max-w-xl w-full", className, {
          "border-transparent bg-transparent shadow-none": !border,
        })}
      >
        <CardHeader>
          <CardTitle className="text-2xl">
            {isLoginView && "Welcome Back."}
            {isRegisterView && "Join Letterpad."}
            {view === "success" && "Check your inbox."}
          </CardTitle>
          <CardDescription>
            {isLoginView &&
              "Enter the email address associated with your account, and we’ll send a magic link to your inbox."}
            {isRegisterView &&
              "Enter your email below and click continue to create an account."}
            {view === "success" &&
              "We have sent a magic link to your email. Click on the link to continue."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">{renderFormContent()}</div>
          {!isSuccessView && <div className="mt-8 text-center text-xs opacity-80">
            Click “Sign {isLoginView ? "in" : "up"}” to agree to Letterpad's{" "}
            <Link href="/terms" target="_blank" className="underline">
              Terms of Service
            </Link>{" "}
            and acknowledge that Letterpad's{" "}
            <Link href="/privacy" target="_blank" className="underline">
              Privacy Policy
            </Link>{" "}
            applies to you.
          </div>}
        </CardContent>
      </Card>
    </form>
  );
};
