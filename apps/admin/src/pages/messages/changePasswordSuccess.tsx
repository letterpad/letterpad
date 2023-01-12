import Head from "next/head";
import { useRouter } from "next/router";
import { Button, Result } from "ui";

const ChangePasswordSuccess = () => {
  const router = useRouter();

  const doLogin = () => {
    router.push("/api/auth/signin");
  };
  return (
    <>
      <Head>
        <title>Success - Password Changed</title>
      </Head>
      <Result
        status="success"
        title="Password Changed"
        subTitle="Your password has been changed successfully"
        extra={[
          <Button key="login" onClick={doLogin}>
            Login
          </Button>,
        ]}
      />
    </>
  );
};
ChangePasswordSuccess.isMessage = true;
export default ChangePasswordSuccess;
