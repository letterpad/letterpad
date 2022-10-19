import { Button, Result } from "antd";
import Head from "next/head";
import { useRouter } from "next/router";

const Verified = () => {
  const router = useRouter();
  const doLogin = () => {
    router.push("/api/auth/signin");
  };
  if (typeof document === "undefined") {
    return null;
  }
  const queryParams = new URLSearchParams(document.location.search);

  if (queryParams.get("msg")) {
    return <Result status="error" title={queryParams.get("msg")} />;
  }
  return (
    <>
      <Head>
        <title>Email Verified</title>
      </Head>
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
    </>
  );
};
Verified.isStatic = true;
export default Verified;
