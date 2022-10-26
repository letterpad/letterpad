import { Result } from "antd";
import Head from "next/head";
import { useRouter } from "next/router";

import { Buttonv2 } from "@/components_v2/button";

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
          <Buttonv2 key="login" onClick={doLogin}>
            Login
          </Buttonv2>,
        ]}
      />
    </>
  );
};
Verified.isStatic = true;
export default Verified;
