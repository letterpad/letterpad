"use client";
import Head from "next/head";
import { useRouter } from "next/navigation";
import { Button, Result } from "ui";

const EmailChanged = () => {
  const router = useRouter();
  const doLogin = () => {
    router.push("/api/auth/signin");
  };
  const queryParams = new URLSearchParams(document.location.search);

  if (queryParams.get("msg")) {
    return <Result status="error" title={queryParams.get("msg") ?? ""} />;
  }
  return (
    <>
      <Head>
        <title>Email Changed</title>
      </Head>
      <Result
        status="success"
        title="Email Changed"
        subTitle={`Your email has been successfully changed to ${queryParams.get(
          "newEmail"
        )}. Click the below button to login`}
        extra={[
          <Button key="login" onClick={doLogin}>
            Login
          </Button>,
        ]}
      />
    </>
  );
};

export default EmailChanged;
