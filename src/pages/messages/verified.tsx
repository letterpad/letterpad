import { Button, Result } from "antd";
import { useRouter } from "next/router";

const Verified = () => {
  if (typeof document === "undefined") {
    return null;
  }
  const router = useRouter();
  const queryParams = new URLSearchParams(document.location.search);
  const doLogin = () => {
    router.push("/api/auth/signin");
  };
  if (queryParams.get("msg")) {
    return <Result status="error" title={queryParams.get("msg")} />;
  }
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
