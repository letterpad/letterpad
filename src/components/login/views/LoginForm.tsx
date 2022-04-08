import { EventAction, track } from "@/track";
import { Divider, message, Row } from "antd";
import { doLogin } from "../actions";
import { key } from "../constants";
import { Form, Input, Button, Checkbox } from "antd";
import Link from "next/link";
import { SocialLogin } from "./SocialLogin";
import { useRouter } from "next/router";
import { basePath } from "@/constants";

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
      let redirectPath = result.redirectUrl.replace(window.location.origin, "");
      if (callbackUrl && typeof callbackUrl === "string") {
        redirectPath = callbackUrl.replace(window.location.origin, "");
      }
      if (redirectPath.includes("/login")) {
        redirectPath = redirectPath.replace("/login", "/posts");
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
      <Row
        justify="center"
        align="middle"
        style={{ marginTop: 20, marginBottom: 20 }}
      >
        <Form
          name="basic"
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 16 }}
          initialValues={{ remember: true }}
          autoComplete="off"
          onFinish={onFinish}
          className="login-form"
        >
          <h2>Login</h2>
          <Divider />
          <Form.Item
            label="Email"
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
            <Input autoComplete="dontshow" data-testid="email" />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            data-testid="input-password"
            rules={[{ required: true, message: "Please input your password!" }]}
          >
            <Input.Password autoComplete="dontshow" data-testid="password" />
          </Form.Item>

          <Form.Item
            name="remember"
            valuePropName="checked"
            wrapperCol={{
              offset: 0,
              span: 16,
              sm: { offset: 6 },
              md: { offset: 6 },
            }}
          >
            <Checkbox>Remember me</Checkbox>
            <Button type="link" onClick={hideSelf}>
              Forgot Password
            </Button>
          </Form.Item>

          <Form.Item
            wrapperCol={{
              offset: 0,
              sm: { offset: 6 },
              md: { offset: 6 },
              span: 16,
            }}
          >
            <Button type="primary" htmlType="submit" data-testid="loginBtn">
              Login
            </Button>
            <Link href="/register">
              <Button type="link">Register</Button>
            </Link>
          </Form.Item>
          <Divider />
          <SocialLogin mode="login" />
        </Form>
        <style jsx global>{`
          .login-form {
            width: 500px;
            padding: 30px;
            background: rgb(var(----section-bg));
            border: 1px solid rgb(var(--color-border));
            border-radius: 2px;
          }
          input:-internal-autofill-selected {
            background-color: transparent !important;
          }
          @media (max-width: 800px) {
            .login-form {
              width: 100%;
              margin: 20px;
            }
          }
        `}</style>
      </Row>
    </>
  );
};
