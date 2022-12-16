import Head from "next/head";
import { useRouter } from "next/router";

import { Buttonv2 } from "@/components_v2/button";
import { Result } from "@/components_v2/result";

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
          <Buttonv2 key="login" onClick={doLogin}>
            Login
          </Buttonv2>,
        ]}
      />
    </>
  );
};
ChangePasswordSuccess.isMessage = true;
export default ChangePasswordSuccess;
