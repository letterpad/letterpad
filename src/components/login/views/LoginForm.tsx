import { EventAction, track } from "@/track";
import { Divider, message } from "antd";
import { doLogin } from "../actions";
import { key } from "../constants";
import { Form, Input, Button, Checkbox } from "antd";
import Link from "next/link";
import { SocialLogin } from "./SocialLogin";
import { useRouter } from "next/router";
import { basePath } from "@/constants";
import { DividerWithOr } from "./Divider";
import { Logo } from "./Logo";
import css from "./style.module.css";
export const LoginForm = ({
  isVisible,
  hideSelf,
}: {
  isVisible: boolean;
  hideSelf: () => void;
}) => {
  const router = useRouter();
  const loginAction = async (email, password) => {
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

  const onFinish = (values: any) => {
    loginAction(values.email, values.password);
  };

  if (!isVisible) {
    return null;
  }

  return (
    <>
      <div className={css.wrapper}>
        <div className={css.leftBox}>
          <span>Letterpad</span>
        </div>
        <div className={css.rightBox}>
          <Form
            name="basic"
            initialValues={{ remember: true }}
            autoComplete="off"
            onFinish={onFinish}
            className={css.forms}
          >
            <Logo />
            <Divider />
            <Form.Item
              name="email"
              data-testid="input-email"
              rules={[
                {
                  required: true,
                  message: "Please input your email!",
                  type: "email",
                },
              ]}
            >
              <Input
                autoComplete="dontshow"
                data-testid="email"
                placeholder="Enter your email"
              />
            </Form.Item>
            <Form.Item
              name="password"
              data-testid="input-password"
              rules={[
                { required: true, message: "Please input your password!" },
              ]}
            >
              <Input.Password
                autoComplete="dontshow"
                data-testid="password"
                placeholder="Enter your password"
              />
            </Form.Item>
            <Form.Item name="remember" valuePropName="checked">
              <Checkbox>Remember me</Checkbox>
              <Button type="link" onClick={hideSelf}>
                Forgot Password
              </Button>
            </Form.Item>
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                data-testid="loginBtn"
                style={{ width: "100%" }}
              >
                Login
              </Button>
            </Form.Item>
            <DividerWithOr />
            <br />
            <SocialLogin mode="login" />
            <br />

            <Form.Item
              name="remember"
              valuePropName="checked"
              style={{ textAlign: "center" }}
            >
              Dont have an account ?
              <Link href="/register">
                <Button type="link">Register Now</Button>
              </Link>
            </Form.Item>
          </Form>
        </div>
      </div>
      <style jsx>{`
        input:-internal-autofill-selected {
          background-color: transparent !important;
        }
      `}</style>
    </>
  );
};
