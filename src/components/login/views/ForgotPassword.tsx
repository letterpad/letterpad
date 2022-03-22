import { useRouter } from "next/router";
import { forgotPasswordAction } from "../actions";
import { Form, Input, Button, Row, Divider } from "antd";
import { EventAction, track } from "@/track";
export const ForgotPassword = ({
  isVisible,
  hideSelf,
}: {
  isVisible: boolean;
  hideSelf: () => void;
}) => {
  const router = useRouter();
  const forgotPassword = async (email) => {
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

  const onFinish = (values: any) => {
    forgotPassword(values.email);
  };

  if (!isVisible) return null;

  return (
    <Row
      justify="center"
      align="middle"
      style={{ marginTop: 20, marginBottom: 20 }}
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
          <Input />
        </Form.Item>
        <Form.Item
          wrapperCol={{
            offset: 4,
            md: { offset: 4 },
            xs: { offset: 0 },
            span: 16,
          }}
        >
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
              width: 100%;
              margin: 20px;
            }
          }
        `}</style>
      </Form>
    </Row>
  );
};
