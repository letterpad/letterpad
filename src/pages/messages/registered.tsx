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
      title="Registration successful"
      subTitle="Congrats! You have successfully registered with Letterpad. You will receive an email shortly from us to verify your identity."
      extra={[
        <Button type="primary" key="login" onClick={doLogin}>
          Login
        </Button>,
      ]}
    />
  );
};

export default Verified;
