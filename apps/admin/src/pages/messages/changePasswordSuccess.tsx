import { Button, Result } from "antd";
import Head from "next/head";
import { useRouter } from "next/router";

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
          <Button type="primary" key="login" onClick={doLogin}>
            Login
          </Button>,
        ]}
        className="flex flex-col justify-center"
      />
    </>
  );
};
ChangePasswordSuccess.isMessage = true;
export default ChangePasswordSuccess;
