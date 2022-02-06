import { EventAction, track } from "@/track";
import { message, Row } from "antd";
import { useCallback } from "react";
import { doLogin } from "../actions";
import { key } from "../constants";
import { Form, Input, Button, Checkbox } from "antd";
import Link from "next/link";

export const LoginForm = ({
  email,
  password,
  isVisible,
  setEmail,
  setPassword,
  hideSelf,
}: {
  email: string;
  password: string;
  isVisible: boolean;
  setEmail: (email: string) => void;
  setPassword: (password: string) => void;
  hideSelf: () => void;
}) => {
  const loginAction = useCallback(async () => {
    const result = await doLogin({ email, password });
    track({
      eventAction: EventAction.Click,
      eventCategory: "login",
      eventLabel: `User logged in`,
    });
    if (result.success && result.redirectUrl) {
      message.success({ key, content: result.message, duration: 5 });
      document.location.href = result.redirectUrl;
      return;
    }
    message.error({ key, content: result.message, duration: 5 });
  }, [email, password]);

  const onFinish = (values: any) => {
    setEmail(values.email);
    setPassword(values.password);
    loginAction();
  };

  if (!isVisible) {
    return null;
  }
  return (
    <Row
      justify="center"
      align="middle"
      style={{ paddingLeft: 10, height: "calc(100% - 60px)" }}
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
        <h1>Login</h1>

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
          <Input />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          data-testid="input-password"
          rules={[{ required: true, message: "Please input your password!" }]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item
          name="remember"
          valuePropName="checked"
          wrapperCol={{ offset: 0, span: 16, md: { offset: 6 } }}
        >
          <Checkbox>Remember me</Checkbox>
          <Button type="link" onClick={hideSelf}>
            Forgot Password
          </Button>
        </Form.Item>

        <Form.Item wrapperCol={{ offset: 0, md: { offset: 6 }, span: 16 }}>
          <Button type="primary" htmlType="submit">
            Login
          </Button>
          <Link href="/register">
            <Button type="link">Register</Button>
          </Link>
        </Form.Item>
      </Form>
      <style jsx global>{`
        .login-form {
          width: 500px;
          padding: 30px;
          background: #fbfbfb;
          border: 1px solid #d9d9d9;
          border-radius: 2px;
        }
        input:-internal-autofill-selected {
          background-color: transparent !important;
        }
        @media (max-width: 800px) {
          .login-form {
            width: initial;
          }
        }
      `}</style>
    </Row>
  );
};
