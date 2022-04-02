import { EventAction, track } from "@/track";
import { GithubFilled, GoogleSquareFilled } from "@ant-design/icons";
import { Button, Form } from "antd";
import { signIn } from "next-auth/react";

interface Props {
  mode: "login" | "register";
}
export const SocialLogin: React.VFC<Props> = ({ mode }) => {
  const onClick = async (e: React.MouseEvent, type: "google" | "github") => {
    e.preventDefault();
    track({
      eventAction: EventAction.Click,
      eventCategory: `social-${mode}`,
      eventLabel: type,
    });
    await signIn(type);
  };
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
        onClick={(e) => onClick(e, "google")}
        type="primary"
      >
        Login with Google
      </Button>
      &nbsp;&nbsp;
      <Button
        icon={<GithubFilled />}
        onClick={(e) => onClick(e, "github")}
        type="primary"
      >
        Login with Github
      </Button>
    </Form.Item>
  );
};
