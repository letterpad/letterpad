import { basePath } from "next.config";
import { useRouter } from "next/router";
import { forgotPasswordAction } from "../actions";
import { Form, Input, Button, Row } from "antd";
export const ForgotPassword = ({
  email,
  isVisible,
  setEmail,
  hideSelf,
}: {
  email: string;
  isVisible: boolean;
  setEmail: (email: string) => void;
  hideSelf: () => void;
}) => {
  const router = useRouter();
  const forgotPassword = async () => {
    const result = await forgotPasswordAction(email);
    if (result) {
      router.push(`${basePath}/login`);
    }
  };

  const onFinish = (values: any) => {
    setEmail(values.email);
    forgotPassword();
  };

  if (!isVisible) return null;
  return (
    <Row
      justify="center"
      align="middle"
      style={{ paddingLeft: 10, height: "100%" }}
    >
      <Form
        name="basic"
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 16 }}
        initialValues={{ remember: true }}
        autoComplete="off"
        onFinish={onFinish}
        className="forgot-password-form"
      >
        <h2>Forgot Password</h2>
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
        <Form.Item wrapperCol={{ offset: 0, md: { offset: 4 }, span: 16 }}>
          <Button type="primary" htmlType="submit">
            Reset Password
          </Button>
          &nbsp;
          <Button type="link" htmlType="submit" onClick={hideSelf}>
            Cancel
          </Button>
        </Form.Item>
        <style jsx global>{`
          .forgot-password-form {
            width: 500px;
            padding: 30px;
            background: #fbfbfb;
            border: 1px solid #d9d9d9;
            border-radius: 2px;
          }
          @media (max-width: 800px) {
            .forgot-password-form {
              width: 300px;
            }
          }
        `}</style>
      </Form>
    </Row>
  );
};
