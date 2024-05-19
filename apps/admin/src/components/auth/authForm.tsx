import classNames from "classnames";
import Link from "next/link";
import { FC, MouseEvent, useState } from "react";
import {
  GoogleReCaptchaProvider,
  useGoogleReCaptcha,
} from "react-google-recaptcha-v3";
import { SubmitHandler, useForm } from "react-hook-form";
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Input,
} from "ui/dist/index.mjs";

import { onLoginAction, onRegisterAction } from "./action";
import { SocialLogin } from "../../app/(public)/login/_feature";

interface FormProps {
  email: string;
}

interface Props {
  serviceUrl: string;
  source: string;
  className?: string;
}

type AuthViews = "login" | "register";

const recaptchaKey = process.env.NEXT_PUBLIC_RECAPTCHA_KEY;

export const AuthForm: FC<Props> = ({ serviceUrl, source, className }) => {
  const [busy, setBusy] = useState(false);
  const { register, handleSubmit } = useForm<FormProps>();
  const [type, setType] = useState<AuthViews>("login");
  const { executeRecaptcha } = useGoogleReCaptcha();

  const onSubmit: SubmitHandler<FormProps> = async (data) => {
    setBusy(true);
    let captchaToken = "";
    try {
      if (type === "login") {
        onLoginAction({ data, serviceUrl, source });
      } else if (type === "register") {
        if (executeRecaptcha && !!recaptchaKey) {
          captchaToken = await executeRecaptcha("register");
        }
        onRegisterAction({ data, captchaToken });
      }
    } catch (e) {
      // console.error(e);
    }
    setBusy(false);
  };

  const switchView = (view: AuthViews) => (e: MouseEvent) => {
    e.preventDefault();
    setType(view);
  };

  const renderFormContent = () => {
    switch (type) {
      case "register":
        return (
          <>
            <AddRecaptchaIfExist>
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
            </AddRecaptchaIfExist>
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
      className="flex items-center justify-center w-full px-8"
    >
      <Card className={classNames("m-auto max-w-xl w-full", className)}>
        <CardHeader>
          <CardTitle className="text-2xl">
            {type === "login" && "Welcome Back."}
            {type === "register" && "Join Letterpad."}
          </CardTitle>
          <CardDescription>
            {type === "login" &&
              "Enter the email address associated with your account, and we’ll send a magic link to your inbox."}
            {type === "register" &&
              "Enter your email below to register your account"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">{renderFormContent()}</div>
        </CardContent>
      </Card>
    </form>
  );
};

const AddRecaptchaIfExist = ({ children }) => {
  if (!recaptchaKey) return children;
  return (
    <GoogleReCaptchaProvider reCaptchaKey={recaptchaKey}>
      {children}
    </GoogleReCaptchaProvider>
  );
};
