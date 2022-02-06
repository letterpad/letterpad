import { Button, message, Row } from "antd";
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
      <Row justify="space-between" align="middle" style={{ paddingLeft: 10 }}>
        You are logging into a demo account. Few features will be disabled.
        <br />
        <br />
        <Button onClick={loginAction} data-testid="btn-login">
          Enter Now
        </Button>
      </Row>
    </>
  );
};
