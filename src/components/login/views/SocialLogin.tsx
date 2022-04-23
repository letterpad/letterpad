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
        className="google-btn"
        size="large"
      >
        Login with Google
      </Button>
      &nbsp;&nbsp;
      <Button
        icon={<GithubFilled />}
        onClick={(e) => onClick(e, "github")}
        type="primary"
        style={{ width: "100%" }}
        className="github-btn"
        size="large"
      >
        Login with Github
      </Button>
      <style global jsx>{`
        .google-btn {
          background: #c93a23;
          border: 1px solid #8c3b3b;
        }
        .google-btn:hover {
          background: #b0321f;
          border: 1px solid #9f2d2d;
        }
        .github-btn {
          background: #141212;
          border: 1px solid #2b2626;
        }
        .github-btn:hover {
          background: #030303;
          border: 1px solid #3b3838;
        }
      `}</style>
    </div>
  );
};
