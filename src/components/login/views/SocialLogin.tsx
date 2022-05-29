import { GithubFilled, GoogleSquareFilled } from "@ant-design/icons";
import { Button } from "antd";
import { useRouter } from "next/router";
import { signIn } from "next-auth/react";

import { EventAction, track } from "@/track";

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
    <div className="container">
      <Button
        icon={<GoogleSquareFilled />}
        onClick={(e) => onClick(e, "google")}
        type="primary"
        className="google-btn"
        size="large"
      ></Button>
      &nbsp;&nbsp;
      <Button
        icon={<GithubFilled />}
        onClick={(e) => onClick(e, "github")}
        type="primary"
        className="github-btn"
        size="large"
      ></Button>
      <style global jsx>{`
        .container {
          display: flex;
          justify-content: center;
        }
        .google-btn {
          background: #da6a59;
          border: 1px solid #b02e2e;
        }
        .google-btn:hover {
          background: #da6a59;
          border: 1px solid #b02e2e;
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
