import { Result } from "antd";
import Head from "next/head";
import { useRouter } from "next/router";

import { Buttonv2 } from "@/components_v2/button";

const Registered = () => {
  const router = useRouter();

  const doLogin = () => {
    router.push("/api/auth/signin");
  };
  return (
    <>
      <Head>
        <title>Registered Successfully</title>
      </Head>
      <Result
        status="success"
        title="Registration successful"
        subTitle="Congrats! You have successfully registered with Letterpad. You will receive an email shortly from us to verify your identity."
        extra={[
          <Buttonv2 key="login" onClick={doLogin}>
            Login
          </Buttonv2>,
        ]}
      />
    </>
  );
};
Registered.isMessage = true;
export default Registered;
