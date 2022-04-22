import { useRouter } from "next/router";
import { forgotPasswordAction } from "../actions";
import { Form, Input, Button, Divider } from "antd";
import { EventAction, track } from "@/track";

export const ForgotPassword = ({
  isVisible,
  hideSelf,
}: {
  isVisible: boolean;
  hideSelf: () => void;
}) => {
  const router = useRouter();
  const forgotPassword = async (email: string) => {
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
    <div>
      <Form
        name="basic"
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 16 }}
        initialValues={{ remember: true }}
        autoComplete="off"
        onFinish={onFinish}
        className="forms"
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
          .forms {
            width: 500px;
            padding: 30px;
            background: rgb(var(----section-bg));
            border: 1px solid rgb(var(--color-border));
            border-radius: 2px;
            overflow: hidden;
          }
          input:-internal-autofill-selected {
            background-color: transparent !important;
          }
          @media (max-width: 375px) {
            .forms {
              width: 100%;
              padding: 16px;
              border: none;
            }
          }
        `}</style>
      </Form>
    </div>
  );
};
