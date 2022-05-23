import { Button, message } from "antd";
import { useCallback } from "react";
import { doLogin } from "../actions";
import { key } from "../constants";

export const LoginFormDemo = ({ isVisible }: { isVisible: boolean }) => {
  const loginAction = useCallback(async () => {
    const result = await doLogin({ email: "demo@demo.com", password: "demo" });
    if (result.success && result.redirectUrl) {
      message.success({ key, content: result.message, duration: 5 });
      document.location.href = result.redirectUrl;
      return;
    }
    message.error({ key, content: result.message, duration: 5 });
  }, []);

  if (!isVisible) return null;
  return (
    <>
      <div
        className="container"
        style={{ paddingLeft: 10, height: "calc(100% - 70px)" }}
      >
        <span>
          You are logging into a demo account. Few features will be disabled.
        </span>
        <br />
        <br />
        <Button onClick={loginAction} type="primary" data-testid="btn-login">
          Enter Now
        </Button>
      </div>
      <style jsx>{`
        .container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }
      `}</style>
    </>
  );
};
