import { useRouter } from "next/router";
import { forgotPasswordAction } from "../actions";
import { Form, Input, Button, Divider } from "antd";
import { EventAction, track } from "@/track";
import { Logo } from "./Logo";
import css from "./style.module.css";

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
              <Input placeholder="Enter your email" />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit">
                Reset Password
              </Button>
              &nbsp;
              <Button type="link" htmlType="submit" onClick={hideSelf}>
                Cancel
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </>
  );
};
