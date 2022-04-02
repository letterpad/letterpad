import { Button, Result } from "antd";
import { useRouter } from "next/router";

const ChangePasswordSuccess = () => {
  const router = useRouter();

  const doLogin = () => {
    router.push("/api/auth/signin");
  };
  return (
    <Result
      status="success"
      title="Password Changed"
      subTitle="Your password has been changed successfully"
      extra={[
        <Button type="primary" key="login" onClick={doLogin}>
          Login
        </Button>,
      ]}
    />
  );
};
ChangePasswordSuccess.noSession = true;
export default ChangePasswordSuccess;
