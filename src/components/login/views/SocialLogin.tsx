import { EventAction, track } from "@/track";
import { GithubFilled, GoogleSquareFilled } from "@ant-design/icons";
import { Button } from "antd";
import { signIn } from "next-auth/react";
import { useRouter } from "next/router";

interface Props {
  mode: "login" | "register";
}
export const SocialLogin: React.VFC<Props> = ({ mode }) => {
  const router = useRouter();
  const onClick = async (e: React.MouseEvent, type: "google" | "github") => {
    e.preventDefault();
    track({
      eventAction: EventAction.Click,
      eventCategory: `social-${mode}`,
      eventLabel: type,
    });
    const callback =
      typeof router.query.callbackUrl === "string"
        ? router.query.callbackUrl
        : "/admin/posts";
    await signIn(type, { callbackUrl: callback });
  };
  return (
    <div>
      <Button
        icon={<GoogleSquareFilled />}
        onClick={(e) => onClick(e, "google")}
        type="primary"
        style={{ width: "100%" }}
      >
        Login with Google
      </Button>
      &nbsp;&nbsp;
      <Button
        icon={<GithubFilled />}
        onClick={(e) => onClick(e, "github")}
        type="primary"
        style={{ width: "100%" }}
      >
        Login with Github
      </Button>
    </div>
  );
};
