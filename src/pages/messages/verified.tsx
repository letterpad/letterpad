import { Button, Result } from "antd";
import { useRouter } from "next/router";

const Verified = () => {
  const router = useRouter();

  const doLogin = () => {
    router.push("/api/auth/signin");
  };
  return (
    <Result
      status="success"
      title="Email Verified"
      subTitle="Your email has been successfully verified with Letterpad. Click the below button to login"
      extra={[
        <Button type="primary" key="login" onClick={doLogin}>
          Login
        </Button>,
      ]}
    />
  );
};

export default Verified;
