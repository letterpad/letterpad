import { GithubFilled, GoogleSquareFilled } from "@ant-design/icons";
import { Button, Form } from "antd";
import { signIn } from "next-auth/react";

export const SocialLogin = () => {
  return (
    <Form.Item
      wrapperCol={{
        offset: 0,
        sm: { offset: 6 },
        md: { offset: 5 },
        span: 20,
      }}
    >
      <Button
        icon={<GoogleSquareFilled />}
        onClick={async (e) => {
          e.preventDefault();
          await signIn("google");
        }}
      >
        Login with Google
      </Button>
      &nbsp;&nbsp;
      <Button
        icon={<GithubFilled />}
        onClick={async (e) => {
          e.preventDefault();
          await signIn("github");
        }}
      >
        Login with Github
      </Button>
    </Form.Item>
  );
};
