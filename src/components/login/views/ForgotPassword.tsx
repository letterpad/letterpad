import { Row } from "antd";
import { basePath } from "next.config";
import { useRouter } from "next/router";
import { forgotPasswordAction } from "../actions";
import { Block, InputBlock, Button } from "../login.css";

export const ForgotPassword = ({
  email,
  isVisible,
  setEmail,
  hideSelf,
}: {
  email: string;
  isVisible: boolean;
  setEmail: (email: string) => void;
  hideSelf: () => void;
}) => {
  const router = useRouter();
  const forgotPassword = async (e: React.MouseEvent<HTMLButtonElement>) => {
    const result = await forgotPasswordAction(e, email);
    if (result) {
      router.push(`${basePath}/login`);
    }
  };
  return (
    <Block isVisible={isVisible}>
      <InputBlock>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="off"
        />
      </InputBlock>
      <br />
      <Row justify="space-between">
        <Button contained secondary onClick={hideSelf}>
          Cancel
        </Button>
        &nbsp;&nbsp;
        <Button onClick={forgotPassword}>Reset Password</Button>
      </Row>
    </Block>
  );
};
