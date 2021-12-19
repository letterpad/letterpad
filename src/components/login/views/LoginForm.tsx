import { message } from "antd";
import { useCallback } from "react";
import { doLogin } from "../actions";
import { key } from "../constants";
import { Block, Button, InputBlock, Row } from "../login.css";

export const LoginForm = ({
  email,
  password,
  isVisible,
  setEmail,
  setPassword,
  hideSelf,
}: {
  email: string;
  password: string;
  isVisible: boolean;
  setEmail: (email: string) => void;
  setPassword: (password: string) => void;
  hideSelf: () => void;
}) => {
  const loginAction = useCallback(async () => {
    const result = await doLogin({ email, password });
    if (result.success && result.redirectUrl) {
      message.success({ key, content: result.message, duration: 5 });
      document.location.href = result.redirectUrl;
      return;
    }
    message.error({ key, content: result.message, duration: 5 });
  }, [email, password]);

  return (
    <Block isVisible={isVisible}>
      <InputBlock>
        <input
          type="text"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="off"
          data-testid="input-email"
        />
      </InputBlock>
      <InputBlock>
        <input
          type="password"
          placeholder="Enter your password"
          onChange={(e) => setPassword(e.target.value)}
          value={password}
          autoComplete="off"
          onKeyUp={(e: React.KeyboardEvent) => {
            if (e.keyCode === 13) {
              loginAction();
            }
          }}
          data-testid="input-password"
        />
      </InputBlock>
      <Row justify="space-between">
        <InputBlock>
          <a onClick={hideSelf} className="forgot-pwd" href="#">
            Forgot password ?
          </a>
        </InputBlock>
      </Row>
      <br />
      <Row justify="center">
        <Button onClick={loginAction} data-testid="btn-login">
          Enter Now
        </Button>
      </Row>
    </Block>
  );
};
